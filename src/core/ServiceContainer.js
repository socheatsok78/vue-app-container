import axios from 'axios'
import Config from './foundations/Config'
import Http from './foundations/Http'

/**
 * PRIVATE_FIELD Symbol
 */
const PRIVATE_FIELD =
    typeof Symbol === 'undefined'
        ? `__ServiceContainer__${Date.now()}`
        : Symbol('ServiceContainer.private')

export default class ServiceContainer {
    /**
     * Create new instance of Service Container
     * @param {Http} http
     */
    constructor(http) {
        this[PRIVATE_FIELD] = {}
        this[PRIVATE_FIELD].http = http
    }

    /**
     * @returns {Http}
     */
    get http() {
        return this[PRIVATE_FIELD].http
    }

    /**
     * Register a new service
     *
     * @param {string} name Service Name
     * @param {ServiceRegistry} service Service Registry Instance
     */
    register(name, service) {
        if (typeof service !== 'function') {
            throw new Error("Service Register Instance must be a function")
        }

        Object.defineProperty(this, name, {
            get () {
                return service(
                    this.http.instance,
                    this.http.config
                )
            }
        })
    }
}

/**
 * @callback ServiceRegistry
 * @param {axios} $http
 * @param {Config} config
 * @returns {*}
 */
