// import { tick } from 'svelte';

export class ReaperStore<T> {
	#key: string;
	#state: T;
	#listeners: number = 0;
	#version = $state(0);
	#proxies = new WeakMap<object, object>();

	// Custom serialization/deserialization methods
	#serialize: (val: T) => string = JSON.stringify;
	#deserialize: (val: string) => T = JSON.parse;

	/**
	 * Constructor for initializing the store.
	 * @param key - A unique key for localStorage persistence.
	 * @param initialValue - The default state value.
	 * @param options - Custom serialization and deserialization methods.
	 */
	constructor(
		key: string,
		initialValue: T,
		options?: { serialize?: (val: T) => string; deserialize?: (val: string) => T }
	) {
		this.#key = key;
		// Reactive counter
		this.#version = 0;

		if (options?.serialize) this.#serialize = options.serialize;
		if (options?.deserialize) this.#deserialize = options.deserialize;

		try {
			const storedValue = localStorage.getItem(this.#key);
			this.#state = storedValue !== null ? this.#deserialize(storedValue) : initialValue;
			if (storedValue === null) {
				localStorage.setItem(this.#key, this.#serialize(initialValue));
			}
			// console.info('ReaperStore constructor', this.#key, this.#handleStorageEvent);
			window.addEventListener('storage', this.#handleStorageEvent);
			// console.info('ReaperStore constructor', this.#key, window);
		} catch (error) {
			console.error(`Failed to initialize store '${this.#key}':`, error);
			this.#state = initialValue;
		}
	}

	/**
	 * Reactive getter for accessing the state value.
	 */
	get value(): T {
		// this.#version;
		// console.info('ReaperStore getter accessed', this.#key, this.#state);
		return this.#createProxy(this.#state);
	}

	/**
	 * Setter for replacing the entire state and persisting to localStorage.
	 * @param value - The new state value to be set.
	 */
	set value(newValue: T) {
		this.#state = newValue;
		this.#persistState(newValue);
		// Increment a reactive counter
		this.#version += 1;
	}

	/**
	 * Creates a proxy for deeply reactive state, minimizing overhead.
	 * @param value - The object or array to proxy.
	 */
	#createProxy(value: T): T {
		// console.info('Creating proxy for', this.#key, value);
		if (typeof value !== 'object' || value === null) return value;

		if (!this.#proxies.has(value)) {
			const proxy = new Proxy(value, {
				get: (target, prop) => {
					this.#version;
					this.#trackListeners();
					return this.#createProxy(Reflect.get(target, prop));
				},
				set: (target, prop, newValue) => {
					this.#version += 1; // Increment a reactive counter
					Reflect.set(target, prop, newValue);
					this.#persistState(this.#state);
					return true;
				}
			});
			this.#proxies.set(value, proxy);
		}

		return this.#proxies.get(value);
	}

	/**
	 * Persists the state to localStorage with error handling.
	 * @param value - The value to persist.
	 */
	#persistState(value: T) {
		try {
			localStorage.setItem(this.#key, this.#serialize(value));
		} catch (error) {
			console.error(`Failed to persist store '${this.#key}':`, error);
		}
	}

	/**
	 * Tracks active listeners and manages storage event listeners.
	 */
	#trackListeners() {
		if ($effect.tracking()) {
			$effect(() => {
				if (this.#listeners === 0) {
					window.addEventListener('storage', this.#handleStorageEvent);
				}
				this.#listeners++;

				return () => {
					this.#listeners--;
					if (this.#listeners === 0) {
						window.removeEventListener('storage', this.#handleStorageEvent);
					}
				};
			});
		}
		// console.info('Listeners:', this.#listeners);
	}

	/**
	 * Handles storage events for cross-tab synchronization.
	 * @param event - The storage event triggered.
	 */
	#handleStorageEvent = (event: StorageEvent) => {
		if (event.key === this.#key && event.newValue !== null) {
			try {
				const newValue = this.#deserialize(event.newValue);
				this.#state = newValue;
				this.#version += 1; // Trigger reactivity
			} catch (error) {
				console.error(`Failed to handle storage event for '${this.#key}':`, error);
			}
		}
	};

	/**
	 * Static method to create a `ReaperStore` from `localStorage`.
	 * @param key - The key in `localStorage`.
	 * @param options - Custom serialization and deserialization methods.
	 * @returns A new `ReaperStore` initialized with the value from `localStorage`, or `null` if the key does not exist.
	 */
	static fromLocalStorage<T>(
		key: string,
		options?: { serialize?: (val: T) => string; deserialize?: (val: string) => T }
	): ReaperStore<T> | null {
		try {
			const storedValue = localStorage.getItem(key);
			if (storedValue !== null) {
				const initialValue = options?.deserialize
					? options.deserialize(storedValue)
					: JSON.parse(storedValue);
				return new ReaperStore(key, initialValue, options);
			} else {
				console.warn(`Key '${key}' not found in localStorage.`);
				return null;
			}
		} catch (error) {
			console.error(`Failed to create store from localStorage for '${key}':`, error);
			return null;
		}
	}

	/**
	 * Static method to retrieve all `ReaperStore` instances from `localStorage` with a specific prefix.
	 * @param prefix - The prefix for store keys in `localStorage`.
	 * @param options - Custom serialization and deserialization methods.
	 * @returns A record of `ReaperStore` instances keyed by their `localStorage` keys.
	 */

	static getAll(
		prefix: string,
		options?: { serialize?: (val: any) => string; deserialize?: (val: any) => any }
	): Record<string, ReaperStore<any>> {
		const allStores: Record<string, ReaperStore<any>> = {};

		for (let i = 0; i < localStorage.length; i++) {
			const key = localStorage.key(i);
			if (key && key.startsWith(prefix)) {
				try {
					const storedValue = localStorage.getItem(key);
					const initialValue = options?.deserialize
						? options.deserialize(storedValue || '{}')
						: JSON.parse(storedValue || '{}');
					allStores[key] = new ReaperStore(key, initialValue, options);
				} catch (error) {
					console.error(`Failed to parse store from localStorage for '${key}':`, error);
				}
			}
		}

		return allStores;
	}

	/**
	 * Static method to create a prefixed `ReaperStore`.
	 * @param prefix - The prefix to prepend to the key.
	 * @param key - The key for `localStorage`.
	 * @param initialValue - The initial value for the store state.
	 * @param options - Custom serialization and deserialization methods.
	 * @returns A new `ReaperStore` instance.
	 */
	static createWithPrefix<T>(
		prefix: string,
		key: string,
		initialValue: T,
		options?: { serialize?: (val: T) => string; deserialize?: (val: T) => T }
	): ReaperStore<T> {
		const prefixedKey = `${prefix}:${key}`;
		return new ReaperStore(prefixedKey, initialValue, options);
	}
}
