// src/DOM/element/element.js
var Element = class {
  /**
   * Creates an HTML element with the specified options.
   * @param {Object} options - The options for creating the element.
   * @param {string} options.name - The tag name of the element.
   * @param {Array<string>} [options.class] - The classes to add to the element.
   * @param {Object<string, string>} [options.attr] - The attributes to set for the element.
   * @param {string} [options.innerText] - The inner text of the element.
   * @param {string} [options.innerHTML] - The inner HTML of the element.
   * @param {Array<HTMLElement>} [options.children] - The child elements to append to the element.
   * @param {boolean} [options.draggable] - Whether the element should be draggable.
   * @param {string} [options.style] - Optional inline styles to set on the element.
   * @param {boolean} [options.trackMutation] - Whether to monitor changes to the element.
   * @param {Function} [callback] - A callback function to perform additional operations on the created element.
   * @returns {HTMLElement} The created HTML element.
   * @throws Will throw an error if required properties are missing.
   */
  static create(options, callback2) {
    if (!options || !options.name) {
      throw new Error("Element creation requires a 'name' property.");
    }
    const element = document.createElement(options.name);
    if (options.class && Array.isArray(options.class)) {
      options.class.forEach((className) => {
        if (className) {
          element.classList.add(className);
        }
      });
    }
    if (options.attr) {
      for (const key in options.attr) {
        if (Object.hasOwnProperty.call(options.attr, key)) {
          element.setAttribute(key, options.attr[key]);
        }
      }
    }
    if (options.innerText) {
      element.innerText = options.innerText;
    } else if (options.innerHTML) {
      element.innerHTML = options.innerHTML;
    }
    if (options.children && Array.isArray(options.children)) {
      options.children.forEach((child) => {
        if (child instanceof HTMLElement) {
          element.appendChild(child);
        }
      });
    }
    if (options.draggable) {
      element.draggable = true;
    }
    if (options.style) {
      element.style.cssText = options.style;
    }
    if (options.trackMutation) {
      const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
          console.log("Mutation observed:", mutation);
        });
      });
      observer.observe(element, { attributes: true, childList: true, subtree: true });
    }
    if (callback2 && typeof callback2 === "function") {
      callback2(element);
    }
    return element;
  }
  /**
   * Set the HTML content of an element with additional script evaluation.
   * @param {HTMLElement} element - The target element.
   * @param {string} htmlContent - The HTML content to set.
   * @param {boolean} [evaluateScripts=false] - Whether to evaluate <script> tags in the content.
   */
  static setHTML(element, htmlContent, evaluateScripts = false) {
    element.innerHTML = htmlContent;
    if (evaluateScripts) {
      const scripts = element.querySelectorAll("script");
      scripts.forEach((script) => {
        const newScript = document.createElement("script");
        if (script.src) {
          newScript.src = script.src;
        } else {
          newScript.textContent = script.textContent;
        }
        script.replaceWith(newScript);
      });
    }
  }
  /**
   * Get the HTML content of an element and sanitize it to prevent XSS attacks.
   * @param {HTMLElement} element - The target element.
   * @returns {string} - The sanitized HTML content of the element.
   */
  static getHTML(element) {
    const tempDiv = document.createElement("div");
    tempDiv.innerHTML = element.innerHTML;
    tempDiv.querySelectorAll("script, iframe, link").forEach((node) => node.remove());
    return tempDiv.innerHTML;
  }
  /**
   * Set the text content of an element with optional transformation.
   * @param {HTMLElement} element - The target element.
   * @param {string} textContent - The text content to set.
   * @param {Object} [options] - Optional transformations for the text content.
   * @param {boolean} [options.toUpperCase] - Whether to convert the text to uppercase.
   * @param {boolean} [options.toLowerCase] - Whether to convert the text to lowercase.
   */
  static setText(element, textContent, options = {}) {
    if (options.toUpperCase) {
      textContent = textContent.toUpperCase();
    }
    if (options.toLowerCase) {
      textContent = textContent.toLowerCase();
    }
    element.textContent = textContent;
  }
  /**
   * Append a child element to a parent element with recursion.
   * @param {HTMLElement} parentElement - The parent element.
   * @param {HTMLElement} childElement - The child element to append.
   * @param {boolean} [recursive=false] - Whether to recursively append all child nodes.
   */
  static appendElement(parentElement, childElement, recursive = false) {
    if (recursive && childElement.childNodes.length) {
      childElement.childNodes.forEach((child) => {
        if (child instanceof HTMLElement) {
          parentElement.appendChild(child.cloneNode(true));
        }
      });
    } else {
      parentElement.appendChild(childElement);
    }
  }
  /**
   * Appends multiple child elements to a parent element.
   * @param {HTMLElement} parentElement - The parent element to which child elements will be appended.
   * @param {...HTMLElement} childNodes - The child nodes to be appended.
   */
  static appendElements(parentElement, ...childNodes) {
    childNodes.forEach((childNode) => {
      parentElement.appendChild(childNode);
    });
  }
  /**
   * Clone an element with its classes to another element.
   * @param {HTMLElement} sourceElement - The element to clone.
   * @param {HTMLElement} targetElement - The element to which the clone will be appended.
   */
  static cloneElementWithClasses(sourceElement, targetElement) {
    const clonedElement = sourceElement.cloneNode(true);
    targetElement.appendChild(clonedElement);
  }
  /**
   * Wrap an element with another wrapper element.
   * @param {HTMLElement} element - The element to wrap.
   * @param {HTMLElement} wrapperElement - The wrapper element.
   */
  static wrapElement(element, wrapperElement) {
    element.parentNode.insertBefore(wrapperElement, element);
    wrapperElement.appendChild(element);
  }
  /**
  * Unwrap an element by removing its parent and placing its children in its position.
  * @param {HTMLElement} element - The element to unwrap.
  */
  static unwrapElement(element) {
    const parent = element.parentNode;
    while (element.firstChild) {
      parent.insertBefore(element.firstChild, element);
    }
    parent.removeChild(element);
  }
  /**
   * Check if an element is currently visible in the viewport.
   * @param {HTMLElement} element - The element to check.
   * @returns {boolean} - True if the element is visible, false otherwise.
   */
  static isElementVisible(element) {
    const rect = element.getBoundingClientRect();
    return rect.top < window.innerHeight && rect.bottom >= 0;
  }
  /**
   * Check if an element is currently hidden.
   * @param {HTMLElement} element - The element to check.
   * @returns {boolean} - True if the element is hidden, false otherwise.
   */
  static isElementHidden(element) {
    return element.offsetParent === null;
  }
  /**
   * Get the closest ancestor element matching a selector.
   * @param {HTMLElement} element - The target element.
   * @param {string} selector - The CSS selector to match.
   * @returns {HTMLElement|null} - The closest ancestor element matching the selector, or null if not found.
   */
  static getClosestElement(element, selector) {
    return element.closest(selector);
  }
  /**
   * Find the first parent element matching a selector.
   * @param {HTMLElement} element - The target element.
   * @param {string} selector - The CSS selector to match.
   * @returns {HTMLElement|null} - The first parent element matching the selector, or null if not found.
   */
  static findParentElement(element, selector) {
    let currentElement = element.parentElement;
    while (currentElement && !currentElement.matches(selector)) {
      currentElement = currentElement.parentElement;
    }
    return currentElement;
  }
  /**
   * Find all ancestors of an element matching a selector.
   * @param {HTMLElement} element - The target element.
   * @param {string} selector - The CSS selector to match.
   * @returns {Array<HTMLElement>} - An array of ancestor elements matching the selector.
   */
  static findAncestors(element, selector) {
    const ancestors = [];
    let currentElement = element.parentElement;
    while (currentElement) {
      if (currentElement.matches(selector)) {
        ancestors.push(currentElement);
      }
      currentElement = currentElement.parentElement;
    }
    return ancestors;
  }
  /**
   * Find all descendants of a parent element matching a selector.
   * @param {HTMLElement} parentElement - The parent element.
   * @param {string} selector - The CSS selector to match.
   * @returns {Array<HTMLElement>} - An array of descendant elements matching the selector.
   */
  static findDescendants(parentElement, selector) {
    return Array.from(parentElement.querySelectorAll(selector));
  }
  /**
   * Find the closest common ancestor of an array of elements.
   * @param {Array<HTMLElement>} elements - The array of elements.
   * @returns {HTMLElement|null} - The closest common ancestor, or null if not found.
   */
  static closestCommonAncestor(elements) {
    const set1 = /* @__PURE__ */ new Set();
    let currentElement = elements[0];
    while (currentElement) {
      set1.add(currentElement);
      currentElement = currentElement.parentElement;
    }
    for (let i = 1; i < elements.length; i++) {
      currentElement = elements[i];
      while (currentElement) {
        if (set1.has(currentElement)) {
          return currentElement;
        }
        currentElement = currentElement.parentElement;
      }
    }
    return null;
  }
  /**
   * Remove a data attribute from an element.
   * @param {HTMLElement} element - The target element.
   * @param {string} key - The data attribute key to remove.
   */
  static removeElementData(element, key) {
    delete element.dataset[key];
  }
  /**
   * Clear all data attributes from an element.
   * @param {HTMLElement} element - The target element.
   */
  static clearElementData(element) {
    for (const key in element.dataset) {
      delete element.dataset[key];
    }
  }
  /**
   * Get all data attributes and their values from an element.
   * @param {HTMLElement} element - The target element.
   * @returns {Object} - An object containing all data attributes and their values.
   */
  static getDataAttributes(element) {
    return { ...element.dataset };
  }
  /**
   * Generate a unique id with an optional prefix.
   * @param {string} prefix - The optional prefix for the id.
   * @returns {string} - The generated unique id.
   */
  static generateUniqueId(prefix) {
    return (prefix || "") + Math.random().toString(36).substr(2, 9);
  }
  /**
   * Enable event delegation for a parent element.
   * @param {HTMLElement} parentElement - The parent element where the event is bound.
   * @param {string} childSelector - The selector for child elements.
   * @param {string} eventType - The event type to delegate.
   * @param {Function} handler - The event handler.
   */
  static delegateEvent(parentElement, childSelector, eventType, handler) {
    parentElement.addEventListener(eventType, (event) => {
      const potentialElements = parentElement.querySelectorAll(childSelector);
      potentialElements.forEach((el) => {
        if (el === event.target || el.contains(event.target)) {
          handler.call(el, event);
        }
      });
    });
  }
  /**
   * Clone an element deeply with data attributes, styles, and listeners.
   * @param {HTMLElement} element - The element to clone.
   * @param {boolean} [deepClone=true] - Whether to deeply clone all child elements.
   * @param {boolean} [cloneListeners=false] - Whether to clone event listeners.
   * @returns {HTMLElement} The cloned element.
   */
  static cloneElement(element, deepClone = true, cloneListeners = false) {
    const clone = element.cloneNode(deepClone);
    if (cloneListeners) {
      const listeners = getEventListeners(element);
      listeners.forEach((listener) => clone.addEventListener(listener.type, listener.handler));
    }
    return clone;
  }
};

// src/DOM/element/attribute.js
var Attribute = class {
  /**
   * Set the value of an attribute on an element with additional validation.
   * Also ensures the attribute name follows HTML5 standards and allows setting custom data attributes.
   * @param {HTMLElement} element - The target element.
   * @param {string} attributeName - The name of the attribute.
   * @param {string} attributeValue - The value to set for the attribute.
   */
  static setElementAttribute(element, attributeName, attributeValue) {
    if (!element || !(element instanceof HTMLElement)) {
      throw new Error("Invalid HTMLElement provided.");
    }
    if (typeof attributeName !== "string" || attributeName.trim() === "") {
      throw new Error("Attribute name must be a non-empty string.");
    }
    if (/^data-/.test(attributeName)) {
      element.dataset[attributeName.slice(5)] = attributeValue;
    } else {
      element.setAttribute(attributeName, attributeValue);
    }
  }
  /**
   * Remove an attribute from an element, with safe checks.
   * Also handles the removal of data attributes.
   * @param {HTMLElement} element - The target element.
   * @param {string} attributeName - The name of the attribute to remove.
   */
  static removeElementAttribute(element, attributeName) {
    if (!element || !(element instanceof HTMLElement)) {
      throw new Error("Invalid HTMLElement provided.");
    }
    if (/^data-/.test(attributeName)) {
      delete element.dataset[attributeName.slice(5)];
    } else if (element.hasAttribute(attributeName)) {
      element.removeAttribute(attributeName);
    } else {
      console.warn(`Attribute "${attributeName}" does not exist on`, element);
    }
  }
  /**
   * Get the value of an attribute on an element.
   * Also supports getting values of custom data attributes.
   * @param {HTMLElement} element - The target element.
   * @param {string} attributeName - The name of the attribute.
   * @returns {string|null} - The value of the attribute or null if not set.
   */
  static getElementAttribute(element, attributeName) {
    if (!element || !(element instanceof HTMLElement)) {
      throw new Error("Invalid HTMLElement provided.");
    }
    return /^data-/.test(attributeName) ? element.dataset[attributeName.slice(5)] || null : element.getAttribute(attributeName);
  }
  /**
   * Set multiple attributes on an element, optimized with batch processing.
   * Supports setting both regular and data attributes in bulk.
   * @param {HTMLElement} element - The target element.
   * @param {Object} attributes - An object where keys are attribute names and values are attribute values.
   */
  static setElementAttributes(element, attributes) {
    if (!element || !(element instanceof HTMLElement)) {
      throw new Error("Invalid HTMLElement provided.");
    }
    if (!attributes || typeof attributes !== "object") {
      throw new Error("Attributes must be a valid object.");
    }
    Object.keys(attributes).forEach((attributeName) => {
      if (/^data-/.test(attributeName)) {
        element.dataset[attributeName.slice(5)] = attributes[attributeName];
      } else {
        element.setAttribute(attributeName, attributes[attributeName]);
      }
    });
    console.log(`Attributes set:`, attributes, "on", element);
  }
  /**
   * Get all attributes and their values from an element, including data attributes.
   * @param {HTMLElement} element - The target element.
   * @returns {Object} - An object containing all attributes and their values.
   */
  static getAllElementAttributes(element) {
    if (!element || !(element instanceof HTMLElement)) {
      throw new Error("Invalid HTMLElement provided.");
    }
    const attributes = {};
    Array.from(element.attributes).forEach((attr) => {
      attributes[attr.name] = attr.value;
    });
    Object.keys(element.dataset).forEach((dataKey) => {
      attributes[`data-${dataKey}`] = element.dataset[dataKey];
    });
    return attributes;
  }
  /**
   * Check if an element has a specific attribute.
   * Also checks for data attributes.
   * @param {HTMLElement} element - The target element.
   * @param {string} attributeName - The name of the attribute to check.
   * @returns {boolean} - True if the element has the attribute, false otherwise.
   */
  static hasElementAttribute(element, attributeName) {
    if (!element || !(element instanceof HTMLElement)) {
      throw new Error("Invalid HTMLElement provided.");
    }
    return /^data-/.test(attributeName) ? attributeName.slice(5) in element.dataset : element.hasAttribute(attributeName);
  }
  /**
   * Toggle the presence of an attribute on an element.
   * Supports toggling between true/false values for boolean attributes.
   * @param {HTMLElement} element - The target element.
   * @param {string} attributeName - The name of the attribute to toggle.
   */
  static toggleElementAttribute(element, attributeName) {
    if (!element || !(element instanceof HTMLElement)) {
      throw new Error("Invalid HTMLElement provided.");
    }
    if (this.hasElementAttribute(element, attributeName)) {
      this.removeElementAttribute(element, attributeName);
    } else {
      this.setElementAttribute(element, attributeName, "");
    }
    console.log(`Attribute "${attributeName}" toggled on`, element);
  }
  /**
   * Remove all attributes from an element, including data attributes.
   * Optimized for performance by batching removal operations.
   * @param {HTMLElement} element - The target element.
   */
  static removeAllElementAttributes(element) {
    if (!element || !(element instanceof HTMLElement)) {
      throw new Error("Invalid HTMLElement provided.");
    }
    Array.from(element.attributes).forEach((attr) => {
      element.removeAttribute(attr.name);
    });
    Object.keys(element.dataset).forEach((dataKey) => {
      delete element.dataset[dataKey];
    });
    console.log(`All attributes removed from`, element);
  }
};

// src/DOM/composite/object.js
var Obj = class {
  /**
   * Compare two objects for equality.
   * @param {Object} obj1 - The first object.
   * @param {Object} obj2 - The second object.
   * @returns {boolean} - True if the objects are equal, false otherwise.
   */
  static compareObjects(obj1, obj2) {
    if (obj1 === obj2) return true;
    if (obj1 === null || obj2 === null || typeof obj1 !== "object" || typeof obj2 !== "object") {
      return false;
    }
    if (obj1.constructor !== obj2.constructor) return false;
    if (Array.isArray(obj1)) {
      if (obj1.length !== obj2.length) return false;
      return obj1.every((item, index) => this.compareObjects(item, obj2[index]));
    }
    const keys1 = Object.keys(obj1);
    const keys2 = Object.keys(obj2);
    if (keys1.length !== keys2.length) return false;
    for (let key of keys1) {
      if (!keys2.includes(key)) return false;
      if (!this.compareObjects(obj1[key], obj2[key])) return false;
    }
    return true;
  }
  /**
   * Deep clone an object.
   * @param {Object} obj - The object to clone.
   * @param {WeakMap} cache
   * @returns {Object} - The cloned object.
   */
  static deepCloneObject(obj, cache = /* @__PURE__ */ new WeakMap()) {
    if (obj === null || typeof obj !== "object") return obj;
    if (cache.has(obj)) return cache.get(obj);
    let clone;
    if (obj instanceof Date) {
      clone = new Date(obj);
    } else if (obj instanceof RegExp) {
      clone = new RegExp(obj);
    } else if (obj instanceof Map) {
      clone = new Map(Array.from(obj.entries(), ([key, value]) => [this.deepCloneObject(key, cache), this.deepCloneObject(value, cache)]));
    } else if (obj instanceof Set) {
      clone = new Set(Array.from(obj, (value) => this.deepCloneObject(value, cache)));
    } else if (Array.isArray(obj)) {
      clone = obj.map((item) => this.deepCloneObject(item, cache));
    } else {
      clone = {};
      cache.set(obj, clone);
      for (let key in obj) {
        if (obj.hasOwnProperty(key)) {
          clone[key] = this.deepCloneObject(obj[key], cache);
        }
      }
    }
    return clone;
  }
  /**
   * Deep merge two objects.
   * @param {Object} target - The target object.
   * @param {Object} source - The source object.
   * @returns {Object} - The merged object.
   */
  static deepMergeObjects(target, source) {
    if (!this.isPlainObject(target) && !Array.isArray(target)) return source;
    for (const key in source) {
      if (source.hasOwnProperty(key)) {
        const targetValue = target[key];
        const sourceValue = source[key];
        if (Array.isArray(targetValue) && Array.isArray(sourceValue)) {
          target[key] = [.../* @__PURE__ */ new Set([...targetValue, ...sourceValue])];
        } else if (targetValue instanceof Map && sourceValue instanceof Map) {
          sourceValue.forEach((value, key2) => targetValue.set(key2, this.deepMergeObjects(targetValue.get(key2), value)));
        } else if (targetValue instanceof Set && sourceValue instanceof Set) {
          sourceValue.forEach((value) => targetValue.add(value));
        } else if (this.isPlainObject(targetValue) && this.isPlainObject(sourceValue)) {
          target[key] = this.deepMergeObjects({ ...targetValue }, sourceValue);
        } else {
          target[key] = sourceValue;
        }
      }
    }
    return target;
  }
  /**
   * Deep freeze an object.
   * @param {Object} obj - The object to freeze.
   * @returns {Object} - The frozen object.
   */
  static deepFreezeObject(obj) {
    if (obj === null || typeof obj !== "object" || Object.isFrozen(obj)) return obj;
    Object.keys(obj).forEach((key) => {
      const value = obj[key];
      if (typeof value === "object" && value !== null) {
        this.deepFreezeObject(value);
      }
    });
    if (obj instanceof Map) {
      obj.forEach((value, key) => this.deepFreezeObject(value));
    } else if (obj instanceof Set) {
      obj.forEach((value) => this.deepFreezeObject(value));
    }
    return Object.freeze(obj);
  }
  /**
   * Check if an object is a plain object.
   * @param {Object} obj - The object to check.
   * @returns {boolean} - True if the object is a plain object, false otherwise.
   */
  static isPlainObject(obj) {
    return Object.prototype.toString.call(obj) === "[object Object]" && (obj.constructor === Object || typeof obj.constructor === "undefined");
  }
  /**
   * Check if an object is empty (has no own properties).
   * @param {Object} obj - The object to check.
   * @returns {boolean} - True if the object is empty, false otherwise.
   */
  static isObjectEmpty(obj) {
    return Object.keys(obj).length === 0;
  }
  /**
   * Check if two objects are equal.
   * @param {Object} obj1 - The first object.
   * @param {Object} obj2 - The second object.
   * @returns {boolean} - True if the objects are equal, false otherwise.
   */
  static isObjectEqual(obj1, obj2) {
    return JSON.stringify(obj1) === JSON.stringify(obj2);
  }
  /**
   * Check if an object is a subset of another object.
   * @param {Object} subset - The potential subset.
   * @param {Object} superset - The superset.
   * @returns {boolean} - True if the subset is a subset of the superset, false otherwise.
   */
  static isObjectSubset(subset, superset) {
    if (subset === superset) return true;
    for (const key in subset) {
      if (!superset.hasOwnProperty(key)) return false;
      if (typeof subset[key] === "object" && subset[key] !== null) {
        if (!this.isObjectSubset(subset[key], superset[key])) return false;
      } else if (subset[key] !== superset[key]) {
        return false;
      }
    }
    return true;
  }
  /**
   * Map over the values of an object and apply a function.
   * @param {Object} obj - The object.
   * @param {Function} callback - The function to apply to each value.
   * @returns {Object} - A new object with the same keys and the modified values.
   */
  static objectMap(obj, callback2) {
    const mappedObj = {};
    for (const key in obj) {
      if (obj.hasOwnProperty(key)) {
        if (typeof obj[key] === "object" && obj[key] !== null) {
          mappedObj[key] = this.objectMap(obj[key], callback2);
        } else {
          mappedObj[key] = callback2(obj[key], key, obj);
        }
      }
    }
    return mappedObj;
  }
  /**
   * Filter an object based on a predicate function.
   * @param {Object} obj - The object.
   * @param {Function} predicate - The predicate function to filter values.
   * @returns {Object} - A new object containing only the values that satisfy the predicate.
   */
  static objectFilter(obj, predicate) {
    const filteredObj = {};
    for (const key in obj) {
      if (obj.hasOwnProperty(key)) {
        const value = obj[key];
        if (typeof value === "object" && value !== null) {
          const filteredChild = this.objectFilter(value, predicate);
          if (Object.keys(filteredChild).length > 0) filteredObj[key] = filteredChild;
        } else if (predicate(value, key, obj)) {
          filteredObj[key] = value;
        }
      }
    }
    return filteredObj;
  }
  /**
   * Reduce an object to a single value using a callback function.
   * @param {Object} obj - The object.
   * @param {Function} callback - The callback function to execute on each value.
   * @param {*} initialValue - The initial value for the reduction.
   * @returns {*} - The final reduced value.
   */
  static objectReduce(obj, callback2, initialValue) {
    let accumulator = initialValue;
    for (const key in obj) {
      if (obj.hasOwnProperty(key)) {
        const value = obj[key];
        if (typeof value === "object" && value !== null) {
          accumulator = this.objectReduce(value, callback2, accumulator);
        } else {
          accumulator = callback2(accumulator, value, key, obj);
        }
      }
    }
    return accumulator;
  }
  /**
   * Iterate over the values of an object and apply a function.
   * @param {Object} obj - The object.
   * @param {Function} callback - The function to apply to each value.
   */
  static objectForEach(obj, callback2) {
    for (const key in obj) {
      if (obj.hasOwnProperty(key)) {
        callback2(obj[key], key, obj);
      }
    }
  }
  /**
   * Pick specified keys from an object.
   * @param {Object} obj - The object.
   * @param {Array} keys - An array of keys to pick.
   * @returns {Object} - A new object containing only the specified keys.
   */
  static objectPick(obj, keys) {
    const pickedObj = {};
    keys.forEach((key) => {
      if (obj.hasOwnProperty(key)) {
        pickedObj[key] = obj[key];
      }
    });
    return pickedObj;
  }
  /**
   * Omit specified keys from an object.
   * @param {Object} obj - The object.
   * @param {Array} keys - An array of keys to omit.
   * @returns {Object} - A new object excluding the specified keys.
   */
  static objectOmit(obj, keys) {
    const omittedObj = { ...obj };
    keys.forEach((key) => {
      if (omittedObj.hasOwnProperty(key)) {
        delete omittedObj[key];
      }
    });
    return omittedObj;
  }
  /**
   * Rename keys in an object based on a provided key mapping.
   * @param {Object} obj - The object.
   * @param {Object} keyMap - An object representing the key mapping, where keys are old keys and values are new keys.
   * @returns {Object} - A new object with keys renamed according to the key mapping.
   */
  static objectRenameKeys(obj, keyMap) {
    const renamedObj = {};
    for (const key in obj) {
      if (obj.hasOwnProperty(key)) {
        const newKey = keyMap[key] || key;
        renamedObj[newKey] = obj[key];
      }
    }
    return renamedObj;
  }
  /**
   * Flip keys and values in an object.
   * @param {Object} obj - The object.
   * @returns {Object} - A new object with keys and values swapped.
   */
  static objectFlipKeys(obj) {
    const flippedObj = {};
    for (const key in obj) {
      if (obj.hasOwnProperty(key)) {
        flippedObj[obj[key]] = key;
      }
    }
    return flippedObj;
  }
  /**
   * Merge two objects.
   * @param {Object} obj1 - The first object.
   * @param {Object} obj2 - The second object.
   * @returns {Object} - A new object containing the merged properties of obj1 and obj2.
   */
  static objectMerge(obj1, obj2) {
    return { ...obj1, ...obj2 };
  }
  /**
   * Zip two arrays into an object where the elements of the first array become keys and the elements of the second array become values.
   * @param {Array} keys - The array of keys.
   * @param {Array} values - The array of values.
   * @returns {Object} - A new object zipped from the keys and values arrays.
   */
  static objectZip(keys, values) {
    const zippedObj = {};
    const length = Math.min(keys.length, values.length);
    for (let i = 0; i < length; i++) {
      zippedObj[keys[i]] = values[i];
    }
    return zippedObj;
  }
  /**
   * Convert an object to a query string.
   * @param {Object} obj - The object.
   * @returns {string} - A query string representation of the object.
   */
  static objectToQueryString(obj) {
    const queryString = Object.entries(obj).map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(value)}`).join("&");
    return queryString;
  }
};

// src/DOM/composite/string.js
var String = class {
  /**
   * Check if a string is empty.
   * @param {string} value - The string to check.
   * @returns {boolean} - True if the string is empty, false otherwise.
   */
  static isEmptyString(value) {
    if (typeof value !== "string") {
      console.warn("isEmptyString: Input is not a string.");
      return false;
    }
    const trimmed = value.trim();
    return trimmed.length === 0;
  }
  /**
  * Trim leading and trailing whitespace from a string, including newlines and tabs.
  * Provides custom trimming for specific characters.
  * @param {string} value - The string to trim.
  * @param {string} [chars] - Optional characters to trim, defaults to whitespace.
  * @returns {string} - The trimmed string.
  */
  static trimString(value, chars = " \n	\r") {
    if (typeof value !== "string") {
      throw new Error("trimString: Input must be a string.");
    }
    const regex = new RegExp(`^[${chars}]+|[${chars}]+$`, "g");
    return value.replace(regex, "");
  }
  /**
   * Capitalize the first letter of each word in a string, supporting various word separators.
   * Handles cases where words are already capitalized or include special characters.
   * @param {string} value - The string to capitalize.
   * @param {string} [separator=' '] - Optional word separator.
   * @returns {string} - The capitalized string.
   */
  static capitalizeString(value, separator = " ") {
    if (typeof value !== "string") {
      throw new Error("capitalizeString: Input must be a string.");
    }
    return value.split(separator).map((word) => {
      if (word.length === 0) return word;
      return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
    }).join(separator);
  }
  /**
   * Check if a string starts with a specific substring. Supports case-sensitive or case-insensitive checks.
   * @param {string} mainString - The main string.
   * @param {string} searchString - The substring to check for.
   * @param {boolean} [caseSensitive=true] - Whether to perform a case-sensitive search.
   * @returns {boolean} - True if the string starts with the substring, false otherwise.
   */
  static startsWithString(mainString, searchString, caseSensitive = true) {
    if (typeof mainString !== "string" || typeof searchString !== "string") {
      throw new Error("startsWithString: Both inputs must be strings.");
    }
    if (!caseSensitive) {
      mainString = mainString.toLowerCase();
      searchString = searchString.toLowerCase();
    }
    return mainString.startsWith(searchString);
  }
  /**
   * Check if a string ends with a specific substring. Supports case-sensitive or case-insensitive checks.
   * @param {string} mainString - The main string.
   * @param {string} searchString - The substring to check for.
   * @param {boolean} [caseSensitive=true] - Whether to perform a case-sensitive search.
   * @returns {boolean} - True if the string ends with the substring, false otherwise.
   */
  static endsWithString(mainString, searchString, caseSensitive = true) {
    if (typeof mainString !== "string" || typeof searchString !== "string") {
      throw new Error("endsWithString: Both inputs must be strings.");
    }
    if (!caseSensitive) {
      mainString = mainString.toLowerCase();
      searchString = searchString.toLowerCase();
    }
    return mainString.endsWith(searchString);
  }
  /**
   * Check if a string contains a specific substring, with options for case-sensitivity and custom start position.
   * @param {string} mainString - The main string.
   * @param {string} searchString - The substring to check for.
   * @param {boolean} [caseSensitive=true] - Whether to perform a case-sensitive search.
   * @param {number} [startIndex=0] - Position to start searching from.
   * @returns {boolean} - True if the string contains the substring, false otherwise.
   */
  static containsString(mainString, searchString, caseSensitive = true, startIndex = 0) {
    if (typeof mainString !== "string" || typeof searchString !== "string") {
      throw new Error("containsString: Both inputs must be strings.");
    }
    if (startIndex < 0 || startIndex >= mainString.length) {
      console.warn("containsString: Invalid start index.");
      return false;
    }
    if (!caseSensitive) {
      mainString = mainString.toLowerCase();
      searchString = searchString.toLowerCase();
    }
    return mainString.indexOf(searchString, startIndex) !== -1;
  }
  /**
   * Replace all occurrences of a substring in a string, with optional case-sensitivity.
   * @param {string} mainString - The main string.
   * @param {string} searchString - The substring to replace.
   * @param {string} replacement - The string to replace with.
   * @param {boolean} [caseSensitive=true] - Whether to perform a case-sensitive replacement.
   * @returns {string} - The modified string.
   */
  static replaceAllOccurrences(mainString, searchString, replacement, caseSensitive = true) {
    if (typeof mainString !== "string" || typeof searchString !== "string" || typeof replacement !== "string") {
      throw new Error("replaceAllOccurrences: All inputs must be strings.");
    }
    const regexFlags = caseSensitive ? "g" : "gi";
    const escapedSearchString = searchString.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const regex = new RegExp(escapedSearchString, regexFlags);
    return mainString.replace(regex, replacement);
  }
  /**
   * Format a string using values. Uses deep path resolution for nested object properties.
   * @param {string} template - The string template with placeholders.
   * @param {Object} values - The values to replace placeholders in the template.
   * @returns {string} - The formatted string.
   */
  static formatString(template, values) {
    return template.replace(/{([^{}]*)}/g, (match, key) => {
      const keys = key.split(".");
      return keys.reduce((acc, k) => acc && acc[k] !== void 0 ? acc[k] : match, values);
    });
  }
  /**
   * Generate a random string of a specified length, with optional character set.
   * @param {number} length - The length of the random string.
   * @param {string} [charSet] - Optional set of characters to use.
   * @returns {string} - The generated random string.
   */
  static generateRandomString(length, charSet = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789") {
    if (typeof length !== "number" || length <= 0) {
      throw new Error("generateRandomString: Length must be a positive number.");
    }
    const result = [];
    for (let i = 0; i < length; i++) {
      const randomIndex = Math.floor(Math.random() * charSet.length);
      result.push(charSet[randomIndex]);
    }
    return result.join("");
  }
};

// src/DOM/styling/color.js
var Color = class _Color {
  /**
   * Convert RGB values to Hex color code.
   * @param {number} r - Red value (0-255).
   * @param {number} g - Green value (0-255).
   * @param {number} b - Blue value (0-255).
   * @returns {string} Hex color code.
   */
  static rgbToHex(r, g, b) {
    const toHex = (c) => {
      const hex = c.toString(16);
      return hex.length === 1 ? "0" + hex : hex;
    };
    return "#" + toHex(r) + toHex(g) + toHex(b);
  }
  /**
   * Convert Hex color code to RGB values.
   * @param {string} hex - Hex color code.
   * @returns {?{r: number, g: number, b: number}} RGB values or null if invalid input.
   */
  static hexToRgb(hex) {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16)
    } : null;
  }
  /**
   * Convert RGBA values to Hex color code.
   * @param {number} r - Red value (0-255).
   * @param {number} g - Green value (0-255).
   * @param {number} b - Blue value (0-255).
   * @param {number} a - Alpha value (0-1).
   * @returns {string} Hex color code with alpha.
   */
  static rgbaToHex(r, g, b, a) {
    return _Color.rgbToHex(r, g, b) + Math.round(a * 255).toString(16).padStart(2, "0");
  }
  /**
   * Convert Hex color code to RGBA string.
   * @param {string} hex - Hex color code.
   * @param {number} a - Alpha value (0-1).
   * @returns {?string} RGBA string or null if invalid input.
   */
  static hexToRgba(hex, a) {
    const rgb = _Color.hexToRgb(hex);
    return rgb ? `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${a})` : null;
  }
  /**
   * Calculate color brightness.
   * @param {string} color - Hex color code.
   * @returns {?number} Color brightness (0-1) or null if invalid input.
   */
  static colorBrightness(color) {
    const rgb = _Color.hexToRgb(color);
    return rgb ? (0.299 * rgb.r + 0.587 * rgb.g + 0.114 * rgb.b) / 255 : null;
  }
  /**
   * Calculate color contrast between two colors.
   * @param {string} color1 - Hex color code.
   * @param {string} color2 - Hex color code.
   * @returns {?number} Color contrast (0-1) or null if invalid input.
   */
  static colorContrast(color1, color2) {
    const brightness1 = _Color.colorBrightness(color1);
    const brightness2 = _Color.colorBrightness(color2);
    if (brightness1 !== null && brightness2 !== null) {
      return Math.abs(brightness1 - brightness2);
    }
    return null;
  }
  /**
   * Generate a random Hex color code.
   * @returns {string} Random Hex color code.
   */
  static generateRandomColor() {
    const randomColorComponent = () => Math.floor(Math.random() * 256);
    return _Color.rgbToHex(randomColorComponent(), randomColorComponent(), randomColorComponent());
  }
  /**
   * Darkens a given color by a specified percentage.
   * @param {string} color - The input color (hexadecimal or RGB).
   * @param {number} percentage - The percentage by which to darken the color.
   * @returns {string} The darkened color.
   */
  static darkenColor(color, percentage) {
    const { r, g, b } = _Color.hexToRgb(color);
    const factor = 1 - percentage / 100;
    const newR = Math.floor(r * factor);
    const newG = Math.floor(g * factor);
    const newB = Math.floor(b * factor);
    return _Color.rgbToHex(newR, newG, newB);
  }
  /**
   * Lightens a given color by a specified percentage.
   * @param {string} color - The input color (hexadecimal or RGB).
   * @param {number} percentage - The percentage by which to lighten the color.
   * @returns {string} The lightened color.
   */
  static lightenColor(color, percentage) {
    const { r, g, b } = _Color.hexToRgb(color);
    const factor = 1 + percentage / 100;
    const newR = Math.min(Math.floor(r * factor), 255);
    const newG = Math.min(Math.floor(g * factor), 255);
    const newB = Math.min(Math.floor(b * factor), 255);
    return _Color.rgbToHex(newR, newG, newB);
  }
  /**
   * Calculates the luminance of a given color.
   * @param {string} color - The input color (hexadecimal or RGB).
   * @returns {number} The luminance value.
   */
  static calculateLuminance(color) {
    const { r, g, b } = _Color.hexToRgb(color);
    return (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  }
  /**
  * Checks if two colors are equal.
  * @param {string} color1 - The first color (hexadecimal or RGB).
  * @param {string} color2 - The second color (hexadecimal or RGB).
  * @returns {boolean} True if the colors are equal, false otherwise.
  */
  static areColorsEqual(color1, color2) {
    return color1.toLowerCase() === color2.toLowerCase();
  }
  /**
  * Converts HSL (Hue, Saturation, Lightness) values to RGB format.
  * @param {number} hue - The hue value (0-360).
  * @param {number} saturation - The saturation value (0-100).
  * @param {number} lightness - The lightness value (0-100).
  * @returns {Object} An object containing the red, green, and blue components.
  */
  static hslToRgb(hue, saturation, lightness) {
    const h = hue / 360;
    const s = saturation / 100;
    const l = lightness / 100;
    const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
    const p = 2 * l - q;
    const rgb = {
      r: Math.round(_Color.hueToRgb(p, q, h + 1 / 3) * 255),
      g: Math.round(_Color.hueToRgb(p, q, h) * 255),
      b: Math.round(_Color.hueToRgb(p, q, h - 1 / 3) * 255)
    };
    return rgb;
  }
  static hueToRgb(p, q, t) {
    if (t < 0) t += 1;
    if (t > 1) t -= 1;
    if (t < 1 / 6) return p + (q - p) * 6 * t;
    if (t < 1 / 2) return q;
    if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
    return p;
  }
  /**
  * Converts RGB color components to HSL (Hue, Saturation, Lightness) values.
  * @param {number} red - The red component (0-255).
  * @param {number} green - The green component (0-255).
  * @param {number} blue - The blue component (0-255).
  * @returns {Object} An object containing the hue, saturation, and lightness values.
  */
  static rgbToHsl(red, green, blue) {
    const r = red / 255;
    const g = green / 255;
    const b = blue / 255;
    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    const delta = max - min;
    let h, s, l;
    if (delta === 0) {
      h = 0;
    } else if (max === r) {
      h = (g - b) / delta % 6;
    } else if (max === g) {
      h = (b - r) / delta + 2;
    } else {
      h = (r - g) / delta + 4;
    }
    h = Math.round((h * 60 + 360) % 360);
    l = (max + min) / 2;
    s = delta === 0 ? 0 : delta / (1 - Math.abs(2 * l - 1));
    s = Math.round(s * 100);
    l = Math.round(l * 100);
    return { h, s, l };
  }
  /**
  * Mixes two colors together based on a specified weight.
  * @param {string} color1 - The first color (hexadecimal or RGB).
  * @param {string} color2 - The second color (hexadecimal or RGB).
  * @param {number} weight - The weight of the first color in the mixture (0-1).
  * @returns {string} The resulting mixed color.
  */
  static mixColors(color1, color2, weight) {
    const rgb1 = _Color.hexToRgb(color1);
    const rgb2 = _Color.hexToRgb(color2);
    const mixedColor = {
      r: Math.round(rgb1.r * weight + rgb2.r * (1 - weight)),
      g: Math.round(rgb1.g * weight + rgb2.g * (1 - weight)),
      b: Math.round(rgb1.b * weight + rgb2.b * (1 - weight))
    };
    return _Color.rgbToHex(mixedColor.r, mixedColor.g, mixedColor.b);
  }
  /**
  * Generates a gradient of colors between two given colors.
  * @param {string} startColor - The starting color (hexadecimal or RGB).
  * @param {string} endColor - The ending color (hexadecimal or RGB).
  * @param {number} steps - The number of steps in the gradient.
  * @returns {Array} An array of colors representing the gradient.
  */
  static generateColorGradient(startColor, endColor, steps) {
    const gradient = [];
    for (let i = 0; i < steps; i++) {
      const weight = i / (steps - 1);
      const interpolatedColor = _Color.mixColors(startColor, endColor, weight);
      gradient.push(interpolatedColor);
    }
    return gradient;
  }
  /**
  * Inverts the color by subtracting each RGB component from 255.
  * @param {string} color - The input color (hexadecimal or RGB).
  * @returns {string} The inverted color.
  */
  static invertColor(color) {
    const { r, g, b } = _Color.hexToRgb(color);
    const invertedColor = {
      r: 255 - r,
      g: 255 - g,
      b: 255 - b
    };
    return _Color.rgbToHex(invertedColor.r, invertedColor.g, invertedColor.b);
  }
};

// src/DOM/styling/style.js
var Style = class {
  /**
   * Adds inline CSS styles to an HTML element.
   * @param {HTMLElement} element - The HTML element.
   * @param {Object.<string, string>} styles - An object where keys are style properties and values are style values.
   */
  static addStyles(element, styles) {
    for (const property in styles) {
      if (styles.hasOwnProperty(property)) {
        element.style[property] = styles[property];
      }
    }
  }
  /**
   * Removes inline CSS styles from an HTML element.
   * @param {HTMLElement} element - The HTML element.
   * @param {...string} properties - The names of the style properties to remove.
   */
  static removeStyles(element, ...properties) {
    for (const property of properties) {
      element.style[property] = "";
    }
  }
  /**
   * Retrieves an object containing all inline CSS styles of an HTML element.
   * @param {HTMLElement} element - The HTML element.
   * @returns {Object.<string, string>} An object where keys are style properties and values are style values.
   */
  static getAllStyles(element) {
    const styles = {};
    for (let i = 0; i < element.style.length; i++) {
      const property = element.style[i];
      styles[property] = element.style[property];
    }
    return styles;
  }
  /**
   * Sets the display style property of an HTML element to 'none'.
   * @param {HTMLElement} element - The HTML element.
   */
  static hideElement(element) {
    element.style.display = "none";
  }
  /**
   * Sets the display style property of an HTML element to its default value.
   * @param {HTMLElement} element - The HTML element.
   */
  static showElement(element) {
    element.style.display = "";
  }
  /**
   * Get the computed style of an element.
   * @param {HTMLElement} element - The target element.
   * @param {string} property - The CSS property to retrieve.
   * @returns {string} - The computed value of the specified property.
   */
  static getComputedStyle(element, property) {
    return window.getComputedStyle(element).getPropertyValue(property);
  }
  /**
   * Get the dimensions (width and height) of an element.
   * @param {HTMLElement} element - The target element.
   * @returns {Object} - An object containing 'width' and 'height' properties.
   */
  static getElementDimensions(element) {
    const rect = element.getBoundingClientRect();
    return {
      width: rect.width,
      height: rect.height
    };
  }
  /**
   * Copies the styles from one HTML element to another.
   * @param {HTMLElement} sourceElement - The HTML element whose styles will be copied.
   * @param {HTMLElement} targetElement - The HTML element to which styles will be applied.
   */
  static copyStyles(sourceElement, targetElement) {
    const computedStyles = getComputedStyle(sourceElement);
    for (const property of computedStyles) {
      const propertyValue = getComputedStyle(sourceElement, property);
      targetElement.style[property] = propertyValue;
    }
  }
};

// src/DOM/main/utility.js
var Utility = class {
  /**
   * Adds a CSS class to an HTML element with error handling and optional animation trigger.
   * @param {HTMLElement} element - The HTML element.
   * @param {string} className - The name of the CSS class to add.
   * @param {Object} [options] - Additional options.
   * @param {boolean} [options.checkIfExists=false] - Whether to check if the class already exists before adding.
   * @param {boolean} [options.triggerAnimation=false] - Whether to trigger an animation after the class is added.
   * @throws Will throw an error if the element or className is invalid.
   */
  static addClass(element, className, options = {}) {
    if (!(element instanceof HTMLElement)) {
      throw new Error("Invalid element provided.");
    }
    if (typeof className !== "string" || !className.trim()) {
      throw new Error("Invalid className provided.");
    }
    const { checkIfExists = false, triggerAnimation = false } = options;
    if (checkIfExists && element.classList.contains(className)) {
      console.warn(`Class "${className}" already exists on the element.`);
      return;
    }
    element.classList.add(className);
    if (triggerAnimation) {
      element.style.transition = "opacity 0.5s";
      element.style.opacity = 0;
      setTimeout(() => {
        element.style.opacity = 1;
      }, 10);
    }
  }
  /**
   * Removes a CSS class from an HTML element with advanced logging and state preservation.
   * @param {HTMLElement} element - The HTML element.
   * @param {string} className - The name of the CSS class to remove.
   * @param {Object} [options] - Additional options.
   * @param {boolean} [options.logChanges=false] - Whether to log the class removal.
   * @param {boolean} [options.preserveState=false] - Whether to preserve a backup of the class list for undo functionality.
   */
  static removeClass(element, className, options = {}) {
    if (!(element instanceof HTMLElement)) {
      throw new Error("Invalid element provided.");
    }
    if (typeof className !== "string" || !className.trim()) {
      throw new Error("Invalid className provided.");
    }
    const { logChanges = false, preserveState = false } = options;
    if (preserveState) {
      element.dataset.previousClassList = element.className;
    }
    element.classList.remove(className);
    if (logChanges) {
      console.log(`Class "${className}" removed from element.`);
    }
  }
  /**
   * Checks if an HTML element has a specific CSS class and includes async delay options.
   * @param {HTMLElement} element - The HTML element.
   * @param {string} className - The name of the CSS class to check.
   * @param {Object} [options] - Additional options.
   * @param {number} [options.delay=0] - Optional delay before checking the class, useful in animations.
   * @returns {Promise<boolean>} True if the element has the class, false otherwise.
   */
  static async hasClass(element, className, options = {}) {
    if (!(element instanceof HTMLElement)) {
      throw new Error("Invalid element provided.");
    }
    if (typeof className !== "string" || !className.trim()) {
      throw new Error("Invalid className provided.");
    }
    const { delay = 0 } = options;
    if (delay > 0) {
      await new Promise((resolve) => setTimeout(resolve, delay));
    }
    return element.classList.contains(className);
  }
  /**
   * Toggles a CSS class on an HTML element with conditional behavior and callbacks.
   * @param {HTMLElement} element - The HTML element.
   * @param {string} className - The name of the CSS class to toggle.
   * @param {Object} [options] - Additional options.
   * @param {Function} [options.onAdd] - Callback function when the class is added.
   * @param {Function} [options.onRemove] - Callback function when the class is removed.
   */
  static toggleClass(element, className, options = {}) {
    if (!(element instanceof HTMLElement)) {
      throw new Error("Invalid element provided.");
    }
    if (typeof className !== "string" || !className.trim()) {
      throw new Error("Invalid className provided.");
    }
    const { onAdd, onRemove } = options;
    if (element.classList.toggle(className)) {
      if (typeof onAdd === "function") {
        onAdd(element);
      }
    } else {
      if (typeof onRemove === "function") {
        onRemove(element);
      }
    }
  }
  /**
   * Replaces one CSS class with another on an HTML element, with undo capability.
   * @param {HTMLElement} element - The HTML element.
   * @param {string} oldClass - The class to be replaced.
   * @param {string} newClass - The class to replace it with.
   * @param {Object} [options] - Additional options.
   * @param {boolean} [options.enableUndo=false] - Whether to enable undo functionality.
   * @returns {Function|null} An undo function if undo is enabled, otherwise null.
   */
  static replaceClass(element, oldClass, newClass, options = {}) {
    if (!(element instanceof HTMLElement)) {
      throw new Error("Invalid element provided.");
    }
    if (typeof oldClass !== "string" || !oldClass.trim() || typeof newClass !== "string" || !newClass.trim()) {
      throw new Error("Invalid class names provided.");
    }
    const { enableUndo = false } = options;
    this.removeClass(element, oldClass);
    this.addClass(element, newClass);
    if (enableUndo) {
      const undo = () => {
        this.removeClass(element, newClass);
        this.addClass(element, oldClass);
        console.log(`Undo: Class "${newClass}" replaced back with "${oldClass}".`);
      };
      return undo;
    }
    return null;
  }
  /**
   * Adds multiple CSS classes to an HTML element, with an optional timeout before applying the classes.
   * @param {HTMLElement} element - The HTML element.
   * @param {Array<string>} classNames - The names of the CSS classes to add.
   * @param {Object} [options] - Additional options.
   * @param {number} [options.timeout=0] - Optional delay before applying the classes.
   * @param {boolean} [options.checkForDuplicates=false] - Check for duplicate classes before adding.
   * @returns {Promise<void>} A promise that resolves when all classes are added.
   */
  static async addClasses(element, classNames, options = {}) {
    if (!(element instanceof HTMLElement)) {
      throw new Error("Invalid element provided.");
    }
    if (!Array.isArray(classNames) || classNames.some((name) => typeof name !== "string" || !name.trim())) {
      throw new Error("Invalid classNames provided.");
    }
    const { timeout = 0, checkForDuplicates = false } = options;
    if (timeout > 0) {
      await new Promise((resolve) => setTimeout(resolve, timeout));
    }
    classNames.forEach((className) => {
      if (!checkForDuplicates || !element.classList.contains(className)) {
        element.classList.add(className);
      }
    });
  }
  /**
   * Replaces multiple CSS classes with new ones on an HTML element.
   * @param {HTMLElement} element - The HTML element.
   * @param {Object.<string, string>} classMap - An object where keys are old classes and values are new classes.
   */
  static replaceClasses(element, classMap) {
    for (const oldClass in classMap) {
      if (classMap.hasOwnProperty(oldClass)) {
        this.replaceClass(element, oldClass, classMap[oldClass]);
      }
    }
  }
  /**
   * Toggles a class on an HTML element conditionally based on a provided boolean condition.
   * @param {HTMLElement} element - The HTML element to toggle the class on.
   * @param {boolean} condition - The boolean condition determining which class to toggle.
   * @param {string} trueClass - The class to add when the condition is true.
   * @param {string} falseClass - The class to add when the condition is false.
   * @throws Will throw an error if the parameters are not of the expected types.
   */
  static toggleClassConditionally(element, condition, trueClass, falseClass) {
    if (condition) {
      this.addClass(element, trueClass);
      this.removeClass(element, falseClass);
    } else {
      this.addClass(element, falseClass);
      this.removeClass(element, trueClass);
    }
  }
  /**
   * Checks if an HTML element has any of the specified classes.
   * @param {HTMLElement} element - The HTML element to check for classes.
   * @param {string[]} classArray - An array of class names to check.
   * @returns {boolean} Returns true if the element has any of the specified classes, otherwise false.
   */
  static hasAnyClass(element, classArray) {
    for (const className of classArray) {
      if (typeof className === "string" && this.hasClass(element, className)) {
        return true;
      }
    }
    return false;
  }
  /**
   * Replaces the prefix of classes on an HTML element.
   * @param {HTMLElement} element - The HTML element to replace class prefixes on.
   * @param {string} oldPrefix - The prefix to replace in existing class names.
   * @param {string} newPrefix - The new prefix to replace the old prefix with.
   */
  static replaceClassPrefix(element, oldPrefix, newPrefix) {
    const classNames = Array.from(element.classList);
    classNames.forEach((className) => {
      if (className.startsWith(oldPrefix)) {
        this.removeClass(className);
        this.addClass(element, className.replace(oldPrefix, newPrefix));
      }
    });
  }
  /**
   * Adds a class to an HTML element only if the class is not already present.
   * @param {HTMLElement} element - The HTML element to add the class to.
   * @param {string} className - The class name to add.
   */
  static addUniqueClass(element, className) {
    if (!this.hasClass(element, className)) {
      this.addClass(element, className);
    }
  }
  /**
   * Adds a class when the element enters the viewport.
   * @param {HTMLElement} element - The HTML element to add the class to.
   * @param {string} className - The class name to add.
   */
  static addClassOnViewportEnter(element, className) {
    const handleScroll = () => {
      const rect = this.element.getBoundingClientRect();
      if (rect.top >= 0 && rect.bottom <= window.innerHeight) {
        this.addClass(element, className);
        window.removeEventListener("scroll", handleScroll);
      }
    };
    window.addEventListener("scroll", handleScroll);
    handleScroll();
  }
  /**
   * Toggles a class on focus and removes it on blur.
   * @param {HTMLElement} element - The HTML element to add the class to.
   * @param {string} className - The class name to add.
   */
  static toggleClassOnFocus(element, className) {
    element.addEventListener("focus", () => {
      this.addClass(element, className);
    });
    element.addEventListener("blur", () => {
      this.removeClass(element, className);
    });
  }
  /**
   * Toggles a class when the specified media query changes.
   * @param {HTMLElement} element - The HTML element to add the class to.
   * @param {string} className - The class name to add.
   * @param {string} mediaQuery - The media query string.
   */
  toggleClassOnMediaQueryChange(element, className, mediaQuery) {
    const mediaQueryList = window.matchMedia(mediaQuery);
    const handleMediaQueryChange = (event) => {
      if (event.matches) {
        this.toggleClass(element, className);
      }
    };
    mediaQueryList.addListener(handleMediaQueryChange);
    handleMediaQueryChange(mediaQueryList);
  }
  /**
   * Toggles a class when the element is copied.
   * @param {HTMLElement} element - The HTML element to add the class to.
   * @param {string} className - The class name to add.
   */
  toggleClassOnCopy(element, className) {
    this.element.addEventListener("copy", () => {
      this.toggleClass(element, className);
    });
  }
  /**
   * Toggles a class on an element based on idle time.
   * @param {HTMLElement} element - The target element.
   * @param {string} className - The class name to toggle.
   * @param {number} [idleTime=30000] - The idle time threshold in milliseconds.
   */
  static toggleClassOnIdleTime(element, className, idleTime = 3e4) {
    let idleTimer;
    const resetIdleTimer = () => {
      clearTimeout(idleTimer);
      idleTimer = setTimeout(() => {
        this.toggleClass(element, className);
      }, idleTime);
    };
    document.addEventListener("mousemove", resetIdleTimer);
    document.addEventListener("keypress", resetIdleTimer);
    resetIdleTimer();
  }
  /**
   * Adds a class at regular intervals using setInterval.
   * @param {number} [interval=1000] - The interval in milliseconds.
   */
  static addClassOnInterval(element, className, interval = 1e3) {
    setInterval(() => {
      this.addClass(element, className);
    }, interval);
  }
  /**
   * Removes a class at regular intervals using setInterval.
   * @param {number} [interval=1000] - The interval in milliseconds.
   */
  removeClassOnInterval(element, className, interval = 1e3) {
    setInterval(() => {
      this.removeClass(element, className);
    }, interval);
  }
  /**
   * Toggles a class on an element based on device motion.
   * @param {HTMLElement} element - The target element.
   * @param {string} className - The class name to toggle.
   */
  static toggleClassOnDeviceMotion(element, className) {
    window.addEventListener("deviceorientation", (event) => {
      const tiltThreshold = 20;
      const isTilted = Math.abs(event.beta) > tiltThreshold || Math.abs(event.gamma) > tiltThreshold;
      this.toggleClass(element, className, isTilted);
    });
  }
  /**
   * Toggles a class on an element based on orientation change.
   * @param {HTMLElement} element - The target element.
   * @param {string} className - The class name to toggle.
   */
  static toggleClassOnOrientationChange(element, className) {
    const handleOrientationChange = () => {
      const orientation = window.matchMedia("(orientation: portrait)").matches ? "portrait" : "landscape";
      this.toggleClass(element, `${className}-${orientation}`);
    };
    window.addEventListener("orientationchange", handleOrientationChange);
    handleOrientationChange();
  }
  /**
   * Toggles a class based on horizontal or vertical swipe.
   * @param {HTMLElement} element - The target element.
   * @param {string} className - The base class name to toggle.
   */
  static toggleClassOnSwipe(element, className) {
    let startX, startY;
    element.addEventListener("touchstart", (event) => {
      startX = event.touches[0].clientX;
      startY = event.touches[0].clientY;
    });
    element.addEventListener("touchend", (event) => {
      const deltaX = event.changedTouches[0].clientX - startX;
      const deltaY = event.changedTouches[0].clientY - startY;
      if (Math.abs(deltaX) > Math.abs(deltaY)) {
        this.toggleClass(element, `${className}-horizontal`);
      } else {
        this.toggleClass(element, `${className}-vertical`);
      }
    });
  }
  /**
   * Toggles a class on an element based on network connection status change.
   * @param {HTMLElement} element - The target element.
   * @param {string} className - The class name to toggle.
   */
  static toggleClassOnConnectionStatus(element, className) {
    const handleConnectionChange = () => {
      const isOnline = navigator.onLine;
      this.toggleClass(element, className, isOnline);
    };
    window.addEventListener("online", handleConnectionChange);
    window.addEventListener("offline", handleConnectionChange);
    handleConnectionChange();
  }
  /**
   * Toggles a CSS class on an HTML element based on changes in the user's geolocation.
   * Adds advanced error handling, throttling, and custom callback support.
   * @param {HTMLElement} element - The HTML element.
   * @param {string} className - The CSS class to toggle.
   * @param {Object} [options] - Optional settings for geolocation.
   * @param {boolean} [options.enableThrottling=true] - Enables throttling to limit how often the class is toggled.
   * @param {number} [options.throttleInterval=5000] - Throttle interval in milliseconds (default is 5 seconds).
   * @param {Function} [options.onClassToggle] - Optional callback that triggers whenever the class is toggled.
   * @param {Function} [options.onError] - Optional error handling callback for geolocation errors.
   * @param {Object} [options.geoOptions] - Custom geolocation API options (e.g., enableHighAccuracy, timeout, maximumAge).
   */
  static toggleClassOnGeolocationChange(element, className, options = {}) {
    if (!(element instanceof HTMLElement)) {
      throw new Error("Invalid element provided.");
    }
    if (typeof className !== "string" || !className.trim()) {
      throw new Error("Invalid className provided.");
    }
    const {
      enableThrottling = true,
      throttleInterval = 5e3,
      onClassToggle = null,
      onError = null,
      geoOptions = { enableHighAccuracy: true, timeout: 1e4, maximumAge: 0 }
    } = options;
    let lastToggleTime = 0;
    let classToggled = false;
    const toggleClassWithConditions = (position) => {
      const currentTime = Date.now();
      if (enableThrottling && currentTime - lastToggleTime < throttleInterval) {
        console.log("Throttling geolocation updates, skipping toggle.");
        return;
      }
      this.toggleClass(element, className);
      if (typeof onClassToggle === "function") {
        onClassToggle(position, classToggled);
      }
      classToggled = !classToggled;
      lastToggleTime = currentTime;
    };
    const handleGeolocationError = (error) => {
      console.error("Geolocation error occurred:", error.message);
      if (typeof onError === "function") {
        onError(error);
      }
    };
    const geoWatchId = navigator.geolocation.watchPosition(
      toggleClassWithConditions,
      handleGeolocationError,
      geoOptions
    );
    console.log("Started watching geolocation changes with ID:", geoWatchId);
    return () => {
      navigator.geolocation.clearWatch(geoWatchId);
      console.log("Stopped watching geolocation changes.");
    };
  }
};

// src/DOM/general/drag-drop.js
var DragDrop = class {
  /**
   * Make an element draggable.
   *
   * @param {HTMLElement} draggableElement - The element to make draggable.
   * @param {Object} options - Additional options for configuring drag behavior.
   */
  static setDraggable(draggableElement, options = {}) {
    draggableElement.draggable = true;
    draggableElement.addEventListener("dragstart", (event) => {
      event.dataTransfer.setData("text/plain", "");
      if (options && typeof options.dragStart === "function") {
        options.dragStart(event);
      }
    });
    draggableElement.addEventListener("dragend", (event) => {
      if (options && typeof options.dragEnd === "function") {
        options.dragEnd(event);
      }
    });
  }
  /**
   * Destroy draggable behavior on an element.
   *
   * @param {HTMLElement} draggableElement - The element to remove draggable behavior from.
   */
  static destroyDraggable(draggableElement) {
    draggableElement.draggable = false;
    draggableElement.removeEventListener("dragstart", null);
    draggableElement.removeEventListener("dragend", null);
  }
  /**
   * Disable draggable behavior on an element.
   *
   * @param {HTMLElement} draggableElement - The element to disable draggable behavior on.
   */
  static disableDraggable(draggableElement) {
    draggableElement.draggable = false;
  }
  /**
   * Enable draggable behavior on an element.
   *
   * @param {HTMLElement} draggableElement - The element to enable draggable behavior on.
   */
  static enableDraggable(draggableElement) {
    draggableElement.draggable = true;
  }
  /**
   * Make an element droppable.
   *
   * @param {HTMLElement} droppableElement - The element to make droppable.
   * @param {Object} options - Additional options for configuring drop behavior.
   */
  static createDroppable(droppableElement, options = {}) {
    droppableElement.addEventListener("dragover", (event) => {
      event.preventDefault();
      if (options && typeof options.dragOver === "function") {
        options.dragOver(event);
      }
    });
    droppableElement.addEventListener("drop", (event) => {
      event.preventDefault();
      if (options && typeof options.drop === "function") {
        options.drop(event);
      }
    });
  }
  /**
   * Destroy droppable behavior on an element.
   *
   * @param {HTMLElement} droppableElement - The element to remove droppable behavior from.
   */
  static destroyDroppable(droppableElement) {
    droppableElement.removeEventListener("dragover", null);
    droppableElement.removeEventListener("drop", null);
  }
  /**
   * Disable droppable behavior on an element.
   *
   * @param {HTMLElement} droppableElement - The element to disable droppable behavior on.
   */
  static disableDroppable(droppableElement) {
    droppableElement.removeEventListener("dragover", null);
    droppableElement.removeEventListener("drop", null);
  }
  /**
   * Enable droppable behavior on an element.
   *
   * @param {HTMLElement} droppableElement - The element to enable droppable behavior on.
   */
  static enableDroppable(droppableElement) {
    droppableElement.addEventListener("dragover", (event) => {
      event.preventDefault();
    });
    droppableElement.addEventListener("drop", (event) => {
      event.preventDefault();
    });
  }
};

// src/DOM/general/scroll.js
var Scroll = class {
  /**
   * Fades in an element over a specified duration.
   * @param {HTMLElement} element - The element to fade in.
   * @param {number} duration - The duration of the fade-in animation in milliseconds.
   * @param {Function} [callback] - An optional callback function to execute after the fade-in is complete.
   */
  static fadeIn(element, duration, callback2) {
    const startOpacity = 0;
    const endOpacity = 1;
    this.animateOpacity(element, startOpacity, endOpacity, duration, callback2);
  }
  /**
   * Fades out an element over a specified duration.
   * @param {HTMLElement} element - The element to fade out.
   * @param {number} duration - The duration of the fade-out animation in milliseconds.
   * @param {Function} [callback] - An optional callback function to execute after the fade-out is complete.
   */
  static fadeOut(element, duration, callback2) {
    const startOpacity = 1;
    const endOpacity = 0;
    this.animateOpacity(element, startOpacity, endOpacity, duration, callback2);
  }
  /**
   * Slides down an element over a specified duration.
   * @param {HTMLElement} element - The element to slide down.
   * @param {number} duration - The duration of the slide-down animation in milliseconds.
   * @param {Function} [callback] - An optional callback function to execute after the slide-down is complete.
   */
  static slideDown(element, duration, callback2) {
    this.animateHeight(element, 0, this.getFullHeight(element), duration, callback2);
  }
  /**
   * Slides up an element over a specified duration.
   * @param {HTMLElement} element - The element to slide up.
   * @param {number} duration - The duration of the slide-up animation in milliseconds.
   * @param {Function} [callback] - An optional callback function to execute after the slide-up is complete.
   */
  static slideUp(element, duration, callback2) {
    this.animateHeight(element, this.getFullHeight(element), 0, duration, callback2);
  }
  /**
   * Toggles the visibility of an element by sliding it up or down over a specified duration.
   * @param {HTMLElement} element - The element to toggle.
   * @param {number} duration - The duration of the slide animation in milliseconds.
   * @param {Function} [callback] - An optional callback function to execute after the toggle is complete.
   */
  static slideToggle(element, duration, callback2) {
    if (this.isElementVisible(element)) {
      this.slideUp(element, duration, callback2);
    } else {
      this.slideDown(element, duration, callback2);
    }
  }
  /**
   * Toggles a class on an element when scrolling past a specified offset.
   * @param {HTMLElement} element - The element to toggle the class on.
   * @param {string} className - The class to toggle.
   * @param {number} offset - The offset from the top of the page to trigger the class toggle.
   */
  static toggleClassOnScroll(element, className, offset2) {
    window.addEventListener("scroll", () => {
      const scrollPosition = window.scrollY || window.pageYOffset;
      if (scrollPosition > offset2) {
        Utility.addClass(className);
      } else {
        Utility.removeClass(className);
      }
    });
  }
  /**
   * Scrolls smoothly to the top of the page over a specified duration.
   * @param {number} duration - The duration of the smooth scroll in milliseconds.
   */
  static smoothScrollToTop(duration) {
    const start = window.pageYOffset || document.documentElement.scrollTop;
    const change = -start;
    const increment = 20;
    let currentTime = 0;
    const animateScroll = () => {
      currentTime += increment;
      const val = this.easeInOutQuad(currentTime, start, change, duration);
      window.scrollTo(0, val);
      if (currentTime < duration) {
        setTimeout(animateScroll, increment);
      }
    };
    animateScroll();
  }
  /**
   * Animate opacity of an element.
   * @param {HTMLElement} element - The element to animate.
   * @param {number} startOpacity - The starting opacity value.
   * @param {number} endOpacity - The ending opacity value.
   * @param {number} duration - The duration of the animation in milliseconds.
   * @param {Function} [callback] - An optional callback function to execute after the animation is complete.
   * @private
   */
  static animateOpacity(element, startOpacity, endOpacity, duration, callback2) {
    const startTime = performance.now();
    const animate = (timestamp) => {
      const elapsed = timestamp - startTime;
      const progress = elapsed / duration;
      const opacity = this.easeInOutQuad(progress, startOpacity, endOpacity - startOpacity, 1);
      Style.addStyles(element, { opacity: opacity.toString() });
      if (progress < 1) {
        requestAnimationFrame(animate);
      } else if (callback2) {
        callback2();
      }
    };
    requestAnimationFrame(animate);
  }
  /**
   * Animate height of an element.
   * @param {HTMLElement} element - The element to animate.
   * @param {number} startHeight - The starting height value.
   * @param {number} endHeight - The ending height value.
   * @param {number} duration - The duration of the animation in milliseconds.
   * @param {Function} [callback] - An optional callback function to execute after the animation is complete.
   * @private
   */
  static animateHeight(element, startHeight, endHeight, duration, callback2) {
    const startTime = performance.now();
    const animate = (timestamp) => {
      const elapsed = timestamp - startTime;
      const progress = elapsed / duration;
      const height = this.easeInOutQuad(progress, startHeight, endHeight - startHeight, 1);
      Style.addStyles(element, { height: height + "px" });
      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        Style.addStyles(element, { height: "" });
        if (callback2) {
          callback2();
        }
      }
    };
    requestAnimationFrame(animate);
  }
  /**
   * Get the full height of an element including padding and border.
   * @param {HTMLElement} element - The element.
   * @returns {number} - The full height of the element.
   * @private
   */
  static getFullHeight(element) {
    const style = getComputedStyle(element);
    const height = element.offsetHeight;
    const borderTop = parseFloat(style.borderTopWidth);
    const borderBottom = parseFloat(style.borderBottomWidth);
    const paddingTop = parseFloat(style.paddingTop);
    const paddingBottom = parseFloat(style.paddingBottom);
    return height + borderTop + borderBottom + paddingTop + paddingBottom;
  }
  /**
   * Check if an element is currently visible in the viewport.
   * @param {HTMLElement} element - The element to check.
   * @returns {boolean} - True if the element is visible, false otherwise.
   * @private
   */
  static isElementVisible(element) {
    const rect = element.getBoundingClientRect();
    return rect.top < window.innerHeight && rect.bottom >= 0;
  }
  /**
   * Easing function for animations (quadratic in/out).
   * @param {number} t - The current time.
   * @param {number} b - The starting value.
   * @param {number} c - The change in value.
   * @param {number} d - The duration of the animation.
   * @returns {number} - The eased value.
   * @private
   */
  static easeInOutQuad(t, b, c, d) {
    t /= d / 2;
    if (t < 1) return c / 2 * t * t + b;
    t--;
    return -c / 2 * (t * (t - 2) - 1) + b;
  }
  /**
   * Scrolls smoothly to the specified position over a specified duration.
   * @param {number} targetPosition - The target scroll position.
   * @param {number} duration - The duration of the smooth scroll in milliseconds.
   * @private
   */
  static smoothScrollToPosition(targetPosition, duration) {
    const start = window.pageYOffset || document.documentElement.scrollTop;
    const change = targetPosition - start;
    const increment = 20;
    let currentTime = 0;
    const animateScroll = () => {
      currentTime += increment;
      const val = this.easeInOutQuad(currentTime, start, change, duration);
      window.scrollTo(0, val);
      if (currentTime < duration) {
        setTimeout(animateScroll, increment);
      }
    };
    animateScroll();
  }
  /**
   * Scrolls smoothly to the specified element over a specified duration.
   * @param {HTMLElement} element - The target element to scroll to.
   * @param {number} duration - The duration of the smooth scroll in milliseconds.
   */
  static smoothScrollToElement(element, duration) {
    const elementTop = element.getBoundingClientRect().top + window.scrollY;
    this.smoothScrollToPosition(elementTop, duration);
  }
  /**
   * Scrolls to the specified element without animation.
   * @param {HTMLElement} element - The target element to scroll to.
   */
  static scrollToElement(element) {
    const elementTop = element.getBoundingClientRect().top + window.scrollY;
    window.scrollTo({
      top: elementTop,
      behavior: "auto"
    });
  }
  /**
   * Scrolls smoothly to the top of the page over a specified duration.
   * @param {number} duration - The duration of the smooth scroll in milliseconds.
   */
  static scrollToTop(duration) {
    this.smoothScrollToPosition(0, duration);
  }
  /**
   * Scrolls smoothly to the bottom of the page over a specified duration.
   * @param {number} duration - The duration of the smooth scroll in milliseconds.
   */
  static scrollToBottom(duration) {
    const documentHeight = Math.max(
      document.body.scrollHeight,
      document.body.offsetHeight,
      document.documentElement.clientHeight,
      document.documentElement.scrollHeight,
      document.documentElement.offsetHeight
    );
    const scrollPosition = documentHeight - window.innerHeight;
    this.smoothScrollToPosition(scrollPosition, duration);
  }
  /**
   * Scrolls to the specified position within an element.
   * @param {HTMLElement} element - The element containing the scrollable content.
   * @param {number} position - The target scroll position within the element.
   */
  static scrollToPosition(element, position) {
    element.scrollTop = position;
  }
  /**
   * Gets the current scroll position within an element.
   * @param {HTMLElement} element - The element containing the scrollable content.
   * @returns {number} - The current scroll position within the element.
   */
  static getScrollPosition(element) {
    return element.scrollTop;
  }
  /**
   * Disables scrolling on the entire page.
   */
  static disableScroll() {
    Style.addStyles(document.body, { overflow: "hidden" });
  }
  /**
   * Enables scrolling on the entire page.
   */
  static enableScroll() {
    Style.addStyles(document.body, { overflow: "" });
  }
  /**
   * Gets the current scroll position of the viewport from the top.
   * @returns {number} - The current scroll position of the viewport from the top.
   */
  static getViewportScrollTop() {
    return window.scrollY || window.pageYOffset;
  }
  /**
   * Gets the current scroll position of the viewport from the left.
   * @returns {number} - The current scroll position of the viewport from the left.
   */
  static getViewportScrollLeft() {
    return window.scrollX || window.pageXOffset;
  }
  /**
   * Gets the current scroll position of the entire document from the top.
   * @returns {number} - The current scroll position of the document from the top.
   */
  static getDocumentScrollTop() {
    return document.documentElement.scrollTop || document.body.scrollTop;
  }
  /**
   * Gets the current scroll position of the entire document from the left.
   * @returns {number} - The current scroll position of the document from the left.
   */
  static getDocumentScrollLeft() {
    return document.documentElement.scrollLeft || document.body.scrollLeft;
  }
};

// src/DOM/modal/modal.js
var Modal = class {
  /**
   * Create a modal with the given options.
   *
   * @param {Object} options - Options for configuring the modal (Id, class).
   * @returns {HTMLElement} - The created modal element.
   */
  static createModal(options) {
    const modal = Element.createElement({
      name: "div",
      attr: {
        id: options.is || "modal",
        class: options.class || "modal"
      }
    });
    return modal;
  }
  /**
   * Open a modal with the specified ID.
   *
   * @param {string} modalId - The ID of the modal to be opened.
   */
  static openModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
      Style.addStyles(modal, { display: "block" });
    }
  }
  /**
   * Close a modal with the specified ID.
   *
   * @param {string} modalId - The ID of the modal to be closed.
   */
  static closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
      Style.addStyles(modal, { display: "none" });
    }
  }
  /**
   * Destroy a modal with the specified ID.
   *
   * @param {string} modalId - The ID of the modal to be destroyed.
   */
  static destroyModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
      modal.remove();
    }
  }
  /**
   * Set the content of a modal with the specified ID.
   *
   * @param {string} modalId - The ID of the modal to set content for.
   * @param {string} content - The HTML content to set for the modal.
   */
  static setModalContent(modalId, content) {
    const modal = document.getElementById(modalId);
    if (modal) {
      Element.setHTML(modal, content);
    }
  }
  /**
   * Get the content of a modal with the specified ID.
   *
   * @param {string} modalId - The ID of the modal to get content from.
   * @returns {string} - The HTML content of the modal.
   */
  static getModalContent(modalId) {
    const modal = document.getElementById(modalId);
    return modal ? Element.getHTML(modal) : "";
  }
};

// src/DOM/general/ripple.js
var Ripple = class _Ripple {
  /**
   * Adds a ripple effect to the specified element when clicked.
   * @param {HTMLElement} element - The element to which the ripple effect will be applied.
   * @param {Object} [options] - Additional options for customizing the ripple effect.
   * @param {string} [options.color='rgba(255, 255, 255, 0.5)'] - The color of the ripple effect in CSS color format.
   * @param {string} [options.duration='0.6s'] - The duration of the ripple effect animation in CSS time format.
   * @param {number} [options.size=4] - The size of the ripple effect relative to the element's dimensions.
      * 
      * 
      * Ripple effect css,
      * Add this to your existing CSS file or create a new one
      * 	.ripple {
      * 		position: absolute;
      * 		border-radius: 50%;
      * 		transform: scale(0);
      * 		animation: rippleEffect 0.6s linear;
      * 	}
      *
      * 	@keyframes rippleEffect {
      * 		to {
      * 			transform: scale(4);
      * 			opacity: 0;
      * 		}
      * 	}
      */
  static addRippleEffect(element, options = {}) {
    const defaultOptions = {
      color: "rgba(255, 255, 255, 0.5)",
      duration: "0.6s",
      size: 4
    };
    const mergedOptions = { ...defaultOptions, ...options };
    element.addEventListener("click", function(event) {
      const targetElement = event.currentTarget;
      const ripple = Element.createElement({
        name: "span",
        class: ["ripple"]
      });
      Style.addStyles(ripple, {
        backgroundColor: mergedOptions.color,
        animationDuration: mergedOptions.duration
      });
      const rect = targetElement.getBoundingClientRect();
      const rippleX = event.clientX - rect.left;
      const rippleY = event.clientY - rect.top;
      ripple.style.left = rippleX + "px";
      ripple.style.top = rippleY + "px";
      Element.appendElement(targetElement, ripple);
      ripple.addEventListener("animationend", () => {
        ripple.remove();
      });
    });
  }
  /**
   * Adds a ripple effect to multiple elements based on a CSS selector.
   * @param {string} selector - The CSS selector used to select elements to which the ripple effect will be applied.
   * @param {Object} [options] - Additional options for customizing the ripple effect (same options as addRippleEffect).
   */
  static addRippleEffectToMultiple(selector, options = {}) {
    const elements = document.querySelectorAll(selector);
    elements.forEach((element) => {
      _Ripple.addRippleEffect(element, options);
    });
  }
  /**
   * Removes the ripple effect from the specified element.
   * @param {HTMLElement} element - The element from which the ripple effect will be removed.
   */
  static removeRippleEffect(element) {
    const ripples = element.querySelectorAll(".ripple");
    ripples.forEach((ripple) => {
      ripple.remove();
    });
  }
  /**
   * Removes the ripple effect from multiple elements based on a CSS selector.
   * @param {string} selector - The CSS selector used to select elements from which the ripple effect will be removed.
   */
  static removeRippleEffectFromMultiple(selector) {
    const elements = document.querySelectorAll(selector);
    elements.forEach((element) => {
      _Ripple.removeRippleEffect(element);
    });
  }
};
var RippleEffect = class {
  /**
   * @constructor
   * @param {HTMLElement} element - The element to add the ripple effect to.
   * @param {Object} options - Additional options for customization.
   * @param {number} options.duration - The duration of the ripple effect in milliseconds.
   * @param {string} options.eventType - The event type to trigger the ripple effect.
   * @param {Function} options.createRipple - Function to create a custom ripple element.
   */
  constructor(element, options = {}) {
    this.element = element;
    this.options = {
      duration: options.duration || 400,
      eventType: options.eventType || "mousedown",
      createRipple: options.createRipple || this.createDefaultRipple.bind(this)
    };
    this.element.addEventListener(this.options.eventType, this.handleEvent.bind(this));
  }
  /**
   * Handles the specified event to create a ripple effect.
   * 
   * @param {Event} event - The triggering event.
   */
  handleEvent(event) {
    const ripple = this.options.createRipple();
    Element.appendElement(this.element, ripple);
    const rect = this.element.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    Style.addStyles(ripple, { left: `${x}px`, top: `${y}px` });
    setTimeout(() => {
      ripple.remove();
    }, this.options.duration);
  }
  /**
   * Creates the default ripple element.
   * Users can override this method for custom ripple creation.
   * 
   * @returns {HTMLElement} - The default ripple element.
   */
  createDefaultRipple() {
    const ripple = Element.createElement({
      name: "span",
      class: ["ripple"]
    });
    return ripple;
  }
};

// src/DOM/general/tooltip.js
function Tooltip(targetElement, tooltipContent, callback2) {
  let tooltipElement = null;
  function showTooltip() {
    tooltipElement = Element.createElement({
      name: "div",
      class: ["tooltip"],
      innerText: tooltipContent
    });
    const rect = targetElement.getBoundingClientRect();
    const y = rect.top + window.scrollY - tooltipElement.offsetHeight - 5;
    const targetCenterX = rect.left + window.scrollX + rect.width / 2;
    Element.appendElement(document.body, tooltipElement);
    const tooltipWidth = tooltipElement.offsetWidth;
    Element.removeElement(tooltipElement);
    const x = targetCenterX - tooltipWidth / 2;
    Style.addStyles(tooltipElement, { top: `${y}px`, left: `${x}px`, marginLeft: "0" });
    Element.appendElement(document.body, tooltipElement);
    if (callback2 && typeof callback2 === "function") {
      callback2(tooltipElement);
    }
  }
  function hideTooltip() {
    if (tooltipElement) {
      Element.removeElement(tooltipElement);
      tooltipElement = null;
    }
  }
  function isTouchScreen() {
    return "ontouchstart" in window || navigator.maxTouchPoints > 0;
  }
  const tooltipEnabled = localStorage.getItem("tooltip") !== "false";
  if (!isTouchScreen() && tooltipEnabled) {
    targetElement.addEventListener("mouseenter", showTooltip);
    targetElement.addEventListener("mouseout", hideTooltip);
  }
}

// src/form/main.js
var FormAction = class {
  /**
   * Generates a secure password with multiple customization options, including character sets,
   * entropy calculation, exclusion rules, and cryptographic security.
   * @param {number} length - The length of the password.
   * @param {Object} options - Options for generating the password.
   * @param {string[]} [options.customCharsets] - Array of custom character sets (strings) to use.
   * @param {boolean} [options.includeSymbols=true] - Whether to include symbols in the password.
   * @param {boolean} [options.includeNumbers=true] - Whether to include numbers in the password.
   * @param {boolean} [options.includeUppercase=true] - Whether to include uppercase letters.
   * @param {boolean} [options.includeLowercase=true] - Whether to include lowercase letters.
   * @param {boolean} [options.avoidRepeats=true] - Prevents consecutive repeating characters.
   * @param {boolean} [options.useCryptoRandom=true] - Whether to use a cryptographically secure random generator.
   * @param {number} [options.minEntropy=50] - Minimum entropy for the generated password (in bits).
   * @param {string[]} [options.exclude] - List of characters to exclude from the password.
   * @param {Function} [options.onCharacterSelected] - Custom callback after each character is selected.
   * @returns {string} The generated password.
   * @throws {Error} Throws an error if password criteria cannot be met.
   */
  static generatePassword(length, options = {}) {
    const {
      customCharsets = [],
      includeSymbols = true,
      includeNumbers = true,
      includeUppercase = true,
      includeLowercase = true,
      avoidRepeats = true,
      useCryptoRandom = true,
      minEntropy = 50,
      exclude = [],
      onCharacterSelected = null
    } = options;
    if (length <= 0 || typeof length !== "number") {
      throw new Error("Password length must be a positive number.");
    }
    const lowercaseCharset = "abcdefghijklmnopqrstuvwxyz";
    const uppercaseCharset = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    const numberCharset = "0123456789";
    const symbolCharset = "!@#$%^&*()-_=+[]{}|;:<>,.?/~`";
    let charset = customCharsets.join("") || (includeLowercase ? lowercaseCharset : "") + (includeUppercase ? uppercaseCharset : "") + (includeNumbers ? numberCharset : "") + (includeSymbols ? symbolCharset : "");
    charset = charset.split("").filter((char) => !exclude.includes(char)).join("");
    if (!charset.length) {
      throw new Error("Charset is empty. Please provide valid options or customCharsets.");
    }
    const calculateEntropy = (charLength, pwdLength) => {
      return Math.log2(Math.pow(charLength, pwdLength));
    };
    let entropy = calculateEntropy(charset.length, length);
    if (entropy < minEntropy) {
      throw new Error(`Password entropy (${entropy.toFixed(2)} bits) is below the required minimum (${minEntropy} bits). Increase password length or diversify the charset.`);
    }
    const getRandomIndex = (max) => {
      if (useCryptoRandom && window.crypto && window.crypto.getRandomValues) {
        const randomArray = new Uint32Array(1);
        window.crypto.getRandomValues(randomArray);
        return randomArray[0] % max;
      } else {
        return Math.floor(Math.random() * max);
      }
    };
    let password = "";
    let lastChar = null;
    const pickCharacter = () => {
      let char;
      do {
        const randomIndex = getRandomIndex(charset.length);
        char = charset[randomIndex];
      } while (avoidRepeats && char === lastChar);
      return char;
    };
    for (let i = 0; i < length; i++) {
      const selectedChar = pickCharacter();
      password += selectedChar;
      lastChar = selectedChar;
      if (typeof onCharacterSelected === "function") {
        onCharacterSelected(selectedChar, i);
      }
    }
    entropy = calculateEntropy(charset.length, password.length);
    console.log(`Password generated with entropy: ${entropy.toFixed(2)} bits.`);
    return password;
  }
  /**
   * Encrypt text with a key.
   * @param {string} text - The text to encrypt.
   * @param {string} key - The encryption key.
   * @returns {string} - The encrypted text.
   */
  static encryptText(text, key) {
    const cipher = crypto.createCipheriv("aes-256-cbc", key);
    let encryptedText = cipher.update(text, "utf-8", "hex");
    encryptedText += cipher.final("hex");
    return encryptedText;
  }
  /**
   * Decrypt encrypted text with a key.
   * @param {string} encryptedText - The encrypted text to decrypt.
   * @param {string} key - The decryption key.
   * @returns {string} - The decrypted text.
   */
  static decryptText(encryptedText, key) {
    const decipher = crypto.createDecipheriv("aes-256-cbc", key);
    let decryptedText = decipher.update(encryptedText, "hex", "utf-8");
    decryptedText += decipher.final("utf-8");
    return decryptedText;
  }
  /**
   * Disable all input elements in a form.
   * @param {HTMLFormElement} formElement - The form element to disable.
   */
  static disableForm(formElement) {
    const inputs = formElement.querySelectorAll("input, textarea, select");
    inputs.forEach((input) => input.disabled = true);
  }
  /**
   * Enable all input elements in a form.
   * @param {HTMLFormElement} formElement - The form element to enable.
   */
  static enableForm(formElement) {
    const inputs = formElement.querySelectorAll("input, textarea, select");
    inputs.forEach((input) => input.disabled = false);
  }
  /**
   * Scroll to the first error in a form.
   * @param {HTMLFormElement} formElement - The form element to scroll within.
   */
  static scrollToError(formElement) {
    const firstError = formElement.querySelector(".error");
    if (firstError) {
      firstError.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }
  /**
   * Show an error message associated with an element.
   * @param {HTMLElement} element - The element to show the error message for.
   * @param {string} message - The error message to display.
   */
  static showErrorMessage(element, message) {
    const errorElement = document.createElement("div");
    errorElement.className = "error";
    errorElement.text = message;
    errorElement.prependElement(element.nextSibling);
  }
  /**
   * Hide the error message associated with an element.
   * @param {HTMLElement} element - The element to hide the error message for.
   */
  static hideErrorMessage(element) {
    const errorElement = element.parentNode.querySelector(".error");
    if (errorElement) {
      Element.unwrapElement(errorElement);
    }
  }
  /**
   * Validate an input element.
   * @param {HTMLInputElement} inputElement - The input element to validate.
   * @returns {boolean} - True if the input is valid, false otherwise.
   */
  /**
   * Reset the value of an input element.
   * @param {HTMLInputElement} inputElement - The input element to reset.
   */
  static resetInput(inputElement) {
    inputElement.value = "";
  }
  /**
   * Disable an input element.
   * @param {HTMLInputElement} inputElement - The input element to disable.
   */
  static disableInput(inputElement) {
    inputElement.disabled = true;
  }
  /**
   * Enable an input element.
   * @param {HTMLInputElement} inputElement - The input element to enable.
   */
  static enableInput(inputElement) {
    inputElement.disabled = false;
  }
  /**
   * Toggle the validity of an input element.
   * @param {HTMLInputElement} inputElement - The input element to toggle validity for.
   * @param {boolean} isValid - True if the input is valid, false otherwise.
   */
  static toggleInputValidity(inputElement, isValid) {
    inputElement.setCustomValidity(isValid ? "" : "Invalid input");
  }
  /**
   * Highlight an input element as invalid.
   * @param {HTMLInputElement} inputElement - The input element to highlight.
   */
  static highlightInvalidInput(inputElement) {
    Utility.addClass(inputElement, "invalid");
    if (Utility.hasClass(inputElement, "invalid")) {
      Style.addStyles(inputElement, { borderColor: "red" });
    }
  }
};
var SerializeForm = class {
  /**
   * Serialize form data into a URL-encoded string.
   * @param {HTMLFormElement} formElement - The HTML form element to serialize.
   * @returns {string} URL-encoded form data string.
   */
  static serializeFormData(formElement) {
    const formDataArray = [];
    for (const field of new FormData(formElement)) {
      formDataArray.push(`${encodeURIComponent(field[0])}=${encodeURIComponent(field[1])}`);
    }
    return formDataArray.join("&");
  }
  /**
   * Deserialize URL-encoded form data string and populate the form fields.
   * @param {HTMLFormElement} formElement - The HTML form element to populate.
   * @param {string} data - URL-encoded form data string.
   */
  static deserializeFormData(formElement, data) {
    const formDataPairs = data.split("&");
    for (const pair of formDataPairs) {
      const [name, value] = pair.split("=");
      const decodedName = decodeURIComponent(name);
      const decodedValue = decodeURIComponent(value);
      const inputElement = formElement.elements.namedItem(decodedName);
      if (inputElement) {
        if (inputElement.type === "checkbox" || inputElement.type === "radio") {
          inputElement.checked = inputElement.value === decodedValue;
        } else {
          inputElement.value = decodedValue;
        }
      }
    }
  }
};

// src/form/validate.js
var Validate = class {
  /**
   * Validates an email address.
   *
   * @param {string} email - The email address to validate.
   * @returns {boolean} - Returns true if the email is valid, otherwise false.
   */
  static validateEmailAddress(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return false;
    }
    const [localPart, domainPart] = email.split("@");
    if (localPart.length > 64 || domainPart.length > 255) {
      return false;
    }
    if (email.length > 320) {
      return false;
    }
    const localPartRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+$/;
    if (!localPartRegex.test(localPart)) {
      return false;
    }
    const domainPartRegex = /^[a-zA-Z0-9-]+(\.[a-zA-Z0-9-]+)*$/;
    if (!domainPartRegex.test(domainPart)) {
      return false;
    }
    const tldRegex = /^[a-zA-Z]{2,}$/;
    const topLevelDomain = domainPart.split(".").pop();
    if (!tldRegex.test(topLevelDomain)) {
      return false;
    }
    return true;
  }
  /**
   * Validates a phone number.
   * @param {string} phoneNumber - The phone number to validate.
   * @returns {boolean} - True if the phone number is valid, false otherwise.
   */
  static validatePhoneNumber(phoneNumber) {
    const phoneRegex = /^[0-9+\(\)#\.\s\-]+$/;
    if (!phoneRegex.test(phoneNumber)) {
      return false;
    }
    const digitsOnly = phoneNumber.replace(/\D/g, "");
    if (digitsOnly.length < 8 || digitsOnly.length > 15) {
      return false;
    }
    const countryCodeRegex = /^\+(\d{1,4})$/;
    const countryCodeMatch = phoneNumber.match(countryCodeRegex);
    if (countryCodeMatch && countryCodeMatch[1].length > 4) {
      return false;
    }
    return true;
  }
  /**
   * Validates a JSON Web Token (JWT) entered by the user.
   * @param {string} userToken - The JWT entered by the user for validation.
   * @param {string} secretKey - The secret key used to sign the JWT.
   *
   * @returns {Object} An object containing the validation result.
   * @property {boolean} success - Indicates whether the JWT validation was successful.
   * @property {Object|null} payload - The decoded payload of the JWT (if successful).
   * @property {string} message - A message providing information about the validation result.
   */
  static validateJWT(userToken, secretKey) {
    const tokenParts = userToken.split(".");
    if (tokenParts.length !== 3) {
      return {
        success: false,
        payload: null,
        message: "Invalid JWT format. Please try again."
      };
    }
    const [headerBase64, payloadBase64, signature] = tokenParts;
    try {
      const decodedPayload = JSON.parse(atob(payloadBase64));
      const calculatedSignature = btoa(JSON.stringify(decodedPayload) + secretKey);
      if (calculatedSignature !== signature) {
        throw new Error("Invalid signature");
      }
      return {
        success: true,
        payload: decodedPayload,
        message: "JWT validated successfully!"
      };
    } catch (error) {
      return {
        success: false,
        payload: null,
        message: "Invalid JWT. Please try again."
      };
    }
  }
  /**
   * Validates the strength of a password.
   *
   * @param {string} password - The password to validate.
   * @returns {string} - Returns a string indicating the strength level:
   *   - "Weak" for weak passwords
   *   - "Moderate" for moderately strong passwords
   *   - "Strong" for strong passwords
   *   - "Very Strong" for very strong passwords
   */
  static validatePasswordStrength(password) {
    const minLength = 8;
    const maxLength = 100;
    const uppercaseRegex = /[A-Z]/;
    const lowercaseRegex = /[a-z]/;
    const digitRegex = /\d/;
    const specialCharRegex = /[!@#$%^&*()_+{}\[\]:;<>,.?~\\/-]/;
    if (password.length < minLength) {
      return "Weak - Too short";
    }
    if (password.length > maxLength) {
      return "Moderate - Too long";
    }
    const hasUppercase = uppercaseRegex.test(password);
    const hasLowercase = lowercaseRegex.test(password);
    const hasDigit = digitRegex.test(password);
    const hasSpecialChar = specialCharRegex.test(password);
    const conditionsFulfilled = [hasUppercase, hasLowercase, hasDigit, hasSpecialChar].filter(Boolean).length;
    if (conditionsFulfilled === 1) {
      return "Weak - Low complexity";
    } else if (conditionsFulfilled === 2) {
      return "Moderate - Moderate complexity";
    } else if (conditionsFulfilled === 3) {
      return "Strong - High complexity";
    } else if (conditionsFulfilled === 4) {
      return "Very Strong - Very high complexity";
    } else {
      return "Weak - Insufficient complexity";
    }
  }
};

// src/media/device-media/image.js
var Image2 = class _Image {
  /**
   * Resize an image to fit within specified dimensions while maintaining aspect ratio.
   * @param {File} file - The image file.
   * @param {number} maxWidth - The maximum width of the resized image.
   * @param {number} maxHeight - The maximum height of the resized image.
   * @returns {Promise<Blob>} - A Promise that resolves to the resized image as a Blob.
   */
  static resizeImage(file, maxWidth, maxHeight) {
    return new Promise((resolve, reject) => {
      const img = new _Image();
      img.onload = () => {
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");
        let width = img.width;
        let height = img.height;
        if (width > maxWidth) {
          height *= maxWidth / width;
          width = maxWidth;
        }
        if (height > maxHeight) {
          width *= maxHeight / height;
          height = maxHeight;
        }
        canvas.width = width;
        canvas.height = height;
        ctx.drawImage(img, 0, 0, width, height);
        canvas.toBlob((blob) => resolve(blob), file.type);
      };
      img.onerror = () => reject(new Error("Failed to load image"));
      img.src = URL.createObjectURL(file);
    });
  }
  /**
   * Rotate an image by a specified number of degrees.
   * @param {File} file - The image file.
   * @param {number} degrees - The number of degrees to rotate the image.
   * @returns {Promise<Blob>} - A Promise that resolves to the rotated image as a Blob.
   */
  static rotateImage(file, degrees) {
    return new Promise((resolve, reject) => {
      const img = new _Image();
      img.onload = () => {
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");
        canvas.width = img.height;
        canvas.height = img.width;
        ctx.translate(canvas.width / 2, canvas.height / 2);
        ctx.rotate(degrees * (Math.PI / 180));
        ctx.drawImage(img, -img.width / 2, -img.height / 2, img.width, img.height);
        canvas.toBlob((blob) => resolve(blob), file.type);
      };
      img.onerror = () => reject(new Error("Failed to load image"));
      img.src = URL.createObjectURL(file);
    });
  }
  /**
   * Compress an image by adjusting its quality.
   * @param {File} file - The image file.
   * @param {number} quality - The quality of the compressed image (0 to 1).
   * @returns {Promise<Blob>} - A Promise that resolves to the compressed image as a Blob.
   */
  static compressImage(file, quality) {
    return new Promise((resolve, reject) => {
      const img = new _Image();
      img.onload = () => {
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");
        canvas.width = img.width;
        canvas.height = img.height;
        ctx.drawImage(img, 0, 0, img.width, img.height);
        canvas.toBlob((blob) => resolve(blob), file.type, quality);
      };
      img.onerror = () => reject(new Error("Failed to load image"));
      img.src = URL.createObjectURL(file);
    });
  }
  /**
   * Crop an image based on specified coordinates.
   * @param {File} file - The image file.
   * @param {Object} coordinates - The coordinates for cropping (e.g., { x: 10, y: 20, width: 100, height: 150 }).
   * @returns {Promise<Blob>} - A Promise that resolves to the cropped image as a Blob.
   */
  static cropImage(file, coordinates) {
    return new Promise((resolve, reject) => {
      const img = new _Image();
      img.onload = () => {
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");
        canvas.width = coordinates.width;
        canvas.height = coordinates.height;
        ctx.drawImage(img, -coordinates.x, -coordinates.y, img.width, img.height);
        canvas.toBlob((blob) => resolve(blob), file.type);
      };
      img.onerror = () => reject(new Error("Failed to load image"));
      img.src = URL.createObjectURL(file);
    });
  }
  /**
   * Flip an image along a specified axis.
   * @param {File} file - The image file.
   * @param {string} axis - The axis along which to flip the image ('horizontal' or 'vertical').
   * @returns {Promise<Blob>} - A Promise that resolves to the flipped image as a Blob.
   */
  static flipImage(file, axis) {
    return new Promise((resolve, reject) => {
      const img = new _Image();
      img.onload = () => {
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");
        canvas.width = img.width;
        canvas.height = img.height;
        if (axis === "horizontal") {
          ctx.scale(-1, 1);
          ctx.drawImage(img, -img.width, 0, img.width, img.height);
        } else if (axis === "vertical") {
          ctx.scale(1, -1);
          ctx.drawImage(img, 0, -img.height, img.width, img.height);
        } else {
          reject(new Error('Invalid axis. Use "horizontal" or "vertical".'));
          return;
        }
        canvas.toBlob((blob) => resolve(blob), file.type);
      };
      img.onerror = () => reject(new Error("Failed to load image"));
      img.src = URL.createObjectURL(file);
    });
  }
  /**
   * Convert an image to a base64-encoded string.
   * @param {File} file - The image file.
   * @returns {Promise<string>} - A Promise that resolves to the base64-encoded image string.
   */
  static convertImageToBase64(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        resolve(reader.result.split(",")[1]);
      };
      reader.onerror = () => {
        reject(new Error("Failed to read image as base64."));
      };
      reader.readAsDataURL(file);
    });
  }
  /**
   * Preload a list of images and invoke a callback once all images are loaded.
   * @param {string[]} imageUrls - An array of image URLs to preload.
   * @param {function} callback - The callback function to invoke once all images are loaded.
   */
  static preloadImagesWithCallback(imageUrls, callback2) {
    const images = [];
    let loadedImages = 0;
    function imageLoaded() {
      loadedImages++;
      if (loadedImages === imageUrls.length) {
        callback2(images);
      }
    }
    imageUrls.forEach((url, index) => {
      const img = new _Image();
      img.onload = () => {
        images[index] = img;
        imageLoaded();
      };
      img.onerror = () => {
        console.error(`Failed to load image: ${url}`);
        imageLoaded();
      };
      img.src = url;
    });
  }
  /**
   * Calculate the aspect ratio of an image based on its width and height.
   * @param {number} width - The width of the image.
   * @param {number} height - The height of the image.
   * @returns {number} - The aspect ratio of the image.
   */
  static calculateAspectRatio(width, height) {
    return width / height;
  }
};

// src/media/device-media/capture.js
var Capture = class {
  /**
   * Opens the device camera and streams video to a specified element.
   * @param {Object} options - Options for opening the camera.
   * @param {string} options.targetElementId - The ID of the HTML element to display the camera stream.
   * @returns {Promise<MediaStream>} - A Promise that resolves to the camera stream.
   */
  static openCamera(options) {
    const { targetElementId } = options;
    return new Promise((resolve, reject) => {
      const videoElement = document.getElementById(targetElementId);
      if (!videoElement) {
        reject(new Error(`Element with ID ${targetElementId} not found.`));
        return;
      }
      navigator.mediaDevices.getUserMedia({ video: true }).then((stream) => {
        videoElement.srcObject = stream;
        resolve(stream);
      }).catch((error) => {
        reject(error);
      });
    });
  }
  /**
   * Captures a photo from the camera stream.
   * @param {Object} options - Options for capturing a photo.
   * @param {string} options.targetElementId - The ID of the HTML element to display the camera stream.
   * @returns {Promise<Blob>} - A Promise that resolves to the captured photo as a Blob.
   */
  static capturePhoto(options) {
    const { targetElementId } = options;
    return new Promise((resolve, reject) => {
      const videoElement = document.getElementById(targetElementId);
      if (!videoElement || !videoElement.srcObject) {
        reject(new Error(`Element with ID ${targetElementId} not found or camera not opened.`));
        return;
      }
      const canvas = document.createElement("canvas");
      const context = canvas.getContext("2d");
      videoElement.addEventListener("loadedmetadata", () => {
        canvas.width = videoElement.videoWidth;
        canvas.height = videoElement.videoHeight;
        context.drawImage(videoElement, 0, 0, canvas.width, canvas.height);
        canvas.toBlob((blob) => resolve(blob), "image/jpeg");
      });
      videoElement.onerror = () => {
        reject(new Error("Error capturing photo."));
      };
    });
  }
  /**
   * Records video from the camera stream.
   * @param {Object} options - Options for recording video.
   * @param {string} options.targetElementId - The ID of the HTML element to display the camera stream.
   * @param {number} options.duration - The duration to record.
   * @returns {Promise<Blob>} - A Promise that resolves to the recorded video as a Blob.
   */
  static recordVideo(options) {
    const { targetElementId, duration } = options;
    return new Promise((resolve, reject) => {
      const videoElement = document.getElementById(targetElementId);
      if (!videoElement || !videoElement.srcObject) {
        reject(new Error(`Element with ID ${targetElementId} not found or camera not opened.`));
        return;
      }
      const mediaStream = videoElement.srcObject;
      const mediaRecorder = new MediaRecorder(mediaStream, {
        mimeType: "video/webm"
      });
      const chunks = [];
      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunks.push(event.data);
        }
      };
      mediaRecorder.onstop = () => {
        const videoBlob = new Blob(chunks, { type: "video/webm" });
        resolve(videoBlob);
      };
      mediaRecorder.start();
      setTimeout(() => {
        mediaRecorder.stop();
      }, options.duration || 5e3);
    });
  }
};

// src/media/device-media/fullScreen.js
var FullScreen = class {
  /**
   * Detects whether fullscreen mode is supported in the current browser.
   * @returns {boolean} - True if fullscreen is supported, false otherwise.
   */
  static detectFullscreenSupport() {
    return document.fullscreenEnabled || document.webkitFullscreenEnabled || document.mozFullScreenEnabled || document.msFullscreenEnabled;
  }
  /**
   * Enters fullscreen mode for the specified element.
   * @param {Element} element - The HTML element to enter fullscreen.
   */
  static enterFullscreen(element) {
    if (element.requestFullscreen) {
      element.requestFullscreen();
    } else if (element.webkitRequestFullscreen) {
      element.webkitRequestFullscreen();
    } else if (element.mozRequestFullScreen) {
      element.mozRequestFullScreen();
    } else if (element.msRequestFullscreen) {
      element.msRequestFullscreen();
    }
  }
  /**
   * Exits fullscreen mode.
   */
  static exitFullscreen() {
    if (document.exitFullscreen) {
      document.exitFullscreen();
    } else if (document.webkitExitFullscreen) {
      document.webkitExitFullscreen();
    } else if (document.mozCancelFullScreen) {
      document.mozCancelFullScreen();
    } else if (document.msExitFullscreen) {
      document.msExitFullscreen();
    }
  }
  /**
   * Gets the element currently in fullscreen mode.
   * @returns {Element|null} - The element in fullscreen, or null if no element is in fullscreen.
   */
  static getFullscreenElement() {
    return document.fullscreenElement || document.webkitFullscreenElement || document.mozFullScreenElement || document.msFullscreenElement || null;
  }
};

// src/network/request/server.js
var RequestServer = class {
  /**
   * Makes an AJAX request with the provided options.
   * @param {Object} options - The options for the AJAX request.
   * @param {string} options.method - The HTTP method for the request (e.g., 'GET', 'POST').
   * @param {string} options.url - The URL to make the request to.
   * @param {Object} [options.headers] - Additional headers to include in the request.
   * @param {string|FormData} [options.data] - The data to include in the request body.
   * @param {function} [options.success] - Callback function to handle a successful response.
   * @param {function} [options.error] - Callback function to handle an error response.
   */
  static ajax(options) {
    const xhr = new XMLHttpRequest();
    xhr.open(options.method, options.url, true);
    if (options.headers) {
      for (const [key, value] of Object.entries(options.headers)) {
        xhr.setRequestHeader(key, value);
      }
    }
    xhr.onload = function() {
      if (xhr.status >= 200 && xhr.status < 300) {
        if (options.success) {
          options.success(xhr.responseText);
        }
      } else {
        if (options.error) {
          options.error(`Request failed with status ${xhr.status}`);
        }
      }
    };
    xhr.onerror = function() {
      if (options.error) {
        options.error("Request failed");
      }
    };
    xhr.send(options.data);
  }
  /**
   * Makes a GET request.
   * @param {string} url - The URL for the GET request.
   * @param {Object} data - The data to be sent with the request.
   * @param {function} callback - The callback function to handle the response.
   */
  static get(url, data, callback2) {
    const xhr = new XMLHttpRequest();
    const queryString = Object.entries(data).map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(value)}`).join("&");
    const fullUrl = data ? `${url}?${queryString}` : url;
    xhr.open("GET", fullUrl, true);
    xhr.onreadystatechange = function() {
      if (xhr.readyState === XMLHttpRequest.DONE) {
        if (xhr.status === 200) {
          callback2(JSON.parse(xhr.responseText));
        } else {
          callback2(null);
        }
      }
    };
    xhr.send();
  }
  /**
   * Makes a POST request.
   * @param {string} url - The URL for the POST request.
   * @param {Object} data - The data to be sent with the request.
   * @param {function} callback - The callback function to handle the response.
   */
  static post(url, data, callback2) {
    const xhr = new XMLHttpRequest();
    xhr.open("POST", url, true);
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.onreadystatechange = function() {
      if (xhr.readyState === XMLHttpRequest.DONE) {
        if (xhr.status === 200) {
          callback2(JSON.parse(xhr.responseText));
        } else {
          callback2(null);
        }
      }
    };
    xhr.send(JSON.stringify(data));
  }
  /**
   * Makes a PUT request.
   * @param {string} url - The URL for the PUT request.
   * @param {Object} data - The data to be sent with the request.
   * @param {function} callback - The callback function to handle the response.
   */
  static put(url, data, callback2) {
    const xhr = new XMLHttpRequest();
    xhr.open("PUT", url, true);
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.onreadystatechange = function() {
      if (xhr.readyState === XMLHttpRequest.DONE) {
        if (xhr.status === 200) {
          callback2(JSON.parse(xhr.responseText));
        } else {
          callback2(null);
        }
      }
    };
    xhr.send(JSON.stringify(data));
  }
  /**
   * Makes a PATCH request.
   * @param {string} url - The URL for the PATCH request.
   * @param {Object} data - The data to be sent with the request.
   * @param {function} callback - The callback function to handle the response.
   */
  static patch(url, data, callback2) {
    const xhr = new XMLHttpRequest();
    xhr.open("PATCH", url, true);
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.onreadystatechange = function() {
      if (xhr.readyState === XMLHttpRequest.DONE) {
        if (xhr.status === 200) {
          callback2(JSON.parse(xhr.responseText));
        } else {
          callback2(null);
        }
      }
    };
    xhr.send(JSON.stringify(data));
  }
  /**
   * Makes a DELETE request.
   * @param {string} url - The URL for the DELETE request.
   * @param {Object} data - The data to be sent with the request.
   * @param {function} callback - The callback function to handle the response.
   */
  static deleteRequest(url, data, callback2) {
    const xhr = new XMLHttpRequest();
    const queryString = Object.entries(data).map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(value)}`).join("&");
    const fullUrl = data ? `${url}?${queryString}` : url;
    xhr.open("DELETE", fullUrl, true);
    xhr.onreadystatechange = function() {
      if (xhr.readyState === XMLHttpRequest.DONE) {
        if (xhr.status === 200) {
          callback2(JSON.parse(xhr.responseText));
        } else {
          callback2(null);
        }
      }
    };
    xhr.send();
  }
  /**
   * Makes a JSONP request.
   * @param {string} url - The URL for the JSONP request.
   * @param {function} callback - The callback function to handle the response.
   */
  static jsonp(url, callback2) {
    const script = document.createElement("script");
    script.src = url;
    document.head.appendChild(script);
    window.jsonpCallback = function(data) {
      callback2(data);
      document.head.removeChild(script);
      delete window.jsonpCallback;
    };
  }
  /**
   * Makes a Fetch API request for JSON.
   * @param {string} url - The URL for the Fetch request.
   * @param {Object} options - Additional options for the Fetch request.
   */
  static fetchJson(url, options) {
    fetch(url, options).then((response) => {
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      return response.json();
    }).then((data) => {
      callback(data);
    }).catch((error) => {
      callback(null, error);
    });
  }
};

// src/media/file/file.js
var File = class _File {
  /**
   * Validates whether the file has an allowed file type.
   * @param {File} file - The file to validate.
   * @param {string[]} allowedTypes - An array of allowed MIME types.
   * @returns {boolean} - True if the file type is allowed, false otherwise.
   */
  static validateFileType(file, allowedTypes) {
    const fileType = _File.getMimeType(file);
    return allowedTypes.includes(fileType);
  }
  /**
   * Validates whether the file size is within the specified limit.
   * @param {File} file - The file to validate.
   * @param {number} maxSize - The maximum allowed size in bytes.
   * @returns {boolean} - True if the file size is within the limit, false otherwise.
   */
  static validateFileSize(file, maxSize) {
    return file.size <= maxSize;
  }
  /**
   * Uploads a file using a basic XMLHttpRequest without external dependencies.
   * @param {File} file - The file to upload.
   * @param {string} url - The URL to upload the file to.
   * @param {function} progressCallback - A callback function to handle upload progress (optional).
   * @returns {Promise<string>} - A Promise that resolves to the server response.
   */
  static uploadFile(file, url, progressCallback) {
    return new Promise((resolve, reject) => {
      const formData = new FormData();
      formData.append("file", file);
      RequestServer.post(url, formData, (response) => {
        if (response) {
          resolve(response);
        } else {
          reject(new Error("File upload failed"));
        }
      }, progressCallback);
    });
  }
  /**
   * Downloads a file from the server using the RequestServer class.
   * @param {string} fileUrl - The URL for the zip file to be downloaded.
   * @param {string} fileName - The desired name for the downloaded zip file.
   * @returns {Promise<void>} A Promise that resolves once the download is complete.
   */
  static async downloadZip(fileUrl, fileName) {
    return new Promise((resolve, reject) => {
      RequestServer.get(fileUrl, {}, (response) => {
        if (response) {
          const blob = new Blob([response], { type: "application/zip" });
          const link = document.createElement("a");
          link.href = window.URL.createObjectURL(blob);
          link.download = fileName;
          link.click();
          resolve();
        } else {
          reject(new Error(`Failed to download zip file.`));
        }
      });
    });
  }
  /**
   * Unzips a provided zip file blob and returns an array of extracted files.
   *
   * @param {Blob} zipBlob - The Blob object representing the zip file.
   * @returns {Promise<Array<{ name: string, content: string }>>} A Promise that resolves with an array of objects,
   * each containing the name and content of an extracted file.
   */
  static async unzip(zipBlob) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (event) => {
        const arrayBuffer = event.target.result;
        const zip = new JSZip();
        zip.loadAsync(arrayBuffer).then((zipFiles) => {
          const extractedFiles = [];
          zip.forEach((relativePath, zipEntry) => {
            zipFiles.file(zipEntry.name).async("string").then((content) => {
              extractedFiles.push({ name: zipEntry.name, content });
            });
          });
          Promise.all(extractedFiles).then(() => resolve(extractedFiles)).catch((err) => reject(err));
        }).catch((err) => reject(new Error(`Failed to unzip the file: ${err.message}`)));
      };
      reader.onerror = () => {
        reject(new Error("Error reading zip file."));
      };
      reader.readAsArrayBuffer(zipBlob);
    });
  }
  /**
   * Zips an array of text content into a single zip file.
   *
   * @param {Array<{ name: string, content: string }>} files - Array of objects containing the name and content of each file.
   * @param {string} zipFileName - The desired name for the zip file.
   * @returns {Blob} Blob representing the zip file.
   */
  static zip(files, zipFileName) {
    const zipData = [];
    files.forEach((file) => {
      const content = new TextEncoder().encode(file.content);
      zipData.push({
        name: file.name,
        content,
        contentLength: content.length
      });
    });
    const centralDirectory = [];
    let currentOffset = 0;
    zipData.forEach((file) => {
      centralDirectory.push({
        name: file.name,
        offset: currentOffset,
        contentLength: file.contentLength
      });
      currentOffset += file.contentLength;
    });
    const zipArray = [];
    zipData.forEach((file) => {
      const header = new Uint8Array([
        80,
        75,
        3,
        4,
        // local file header signature
        10,
        0,
        // version needed to extract
        0,
        0,
        // general purpose bit flag
        0,
        0,
        // compression method
        0,
        0,
        0,
        0,
        // file modification time
        0,
        0,
        0,
        0,
        // file modification date
        0,
        0,
        0,
        0,
        // CRC-32
        0,
        0,
        0,
        0,
        // compressed size
        0,
        0,
        0,
        0,
        // uncompressed size
        file.name.length,
        0
        // file name length
      ]);
      const headerArray = new Uint8Array(header.length + file.name.length);
      headerArray.set(header);
      headerArray.set(new TextEncoder().encode(file.name), header.length);
      const content = new Uint8Array(file.content);
      const fileEntry = new Uint8Array(headerArray.length + content.length);
      fileEntry.set(headerArray);
      fileEntry.set(content, headerArray.length);
      zipArray.push(fileEntry);
    });
    const centralDirectoryArray = [];
    centralDirectory.forEach((file) => {
      const header = new Uint8Array([
        80,
        75,
        1,
        2,
        // central file header signature
        10,
        0,
        // version made by
        10,
        0,
        // version needed to extract
        0,
        0,
        // general purpose bit flag
        0,
        0,
        // compression method
        0,
        0,
        0,
        0,
        // file modification time
        0,
        0,
        0,
        0,
        // file modification date
        0,
        0,
        0,
        0,
        // CRC-32
        0,
        0,
        0,
        0,
        // compressed size
        0,
        0,
        0,
        0,
        // uncompressed size
        file.name.length,
        0,
        // file name length
        0,
        0,
        // extra field length
        0,
        0,
        // file comment length
        0,
        0,
        // disk number start
        0,
        0,
        // internal file attributes
        0,
        0,
        0,
        0,
        // external file attributes
        file.currentOffset & 255,
        // relative offset of local header (lo)
        file.currentOffset >> 8 & 255
        // relative offset of local header (hi)
      ]);
      const headerArray = new Uint8Array(header.length + file.name.length);
      headerArray.set(header);
      headerArray.set(new TextEncoder().encode(file.name), header.length);
      centralDirectoryArray.push(headerArray);
    });
    const endOfCentralDirectory = new Uint8Array([
      80,
      75,
      5,
      6,
      // end of central directory signature
      0,
      0,
      0,
      0,
      // number of this disk
      0,
      0,
      0,
      0,
      // number of the disk with the start of the central directory
      centralDirectoryArray.length & 255,
      // total number of entries in the central directory on this disk (lo)
      centralDirectoryArray.length >> 8 & 255,
      // total number of entries in the central directory on this disk (hi)
      centralDirectoryArray.length & 255,
      // total number of entries in the central directory (lo)
      centralDirectoryArray.length >> 8 & 255,
      // total number of entries in the central directory (hi)
      centralDirectoryArray.reduce((acc, entry) => acc + entry.length, 0) & 4294967295,
      // size of the central directory (lo)
      centralDirectoryArray.reduce((acc, entry) => acc + entry.length, 0) >> 8 & 4294967295 & 255,
      // size of the central directory (hi)
      offset & 4294967295 & 255,
      // offset of start of central directory with respect to the starting disk number (lo)
      (offset & 4294967295) >> 8 & 255,
      // offset of start of central directory with respect to the starting disk number (hi)
      0,
      0
      // .zip file comment length
    ]);
    const zipFile = new Uint8Array(zipArray.reduce((acc, entry) => acc + entry.length, 0) + centralDirectoryArray.reduce((acc, entry) => acc + entry.length, 0) + endOfCentralDirectory.length);
    currentOffset = 0;
    zipArray.forEach((entry) => {
      zipFile.set(entry, currentOffset);
      currentOffset += entry.length;
    });
    centralDirectoryArray.forEach((entry) => {
      zipFile.set(entry, currentOffset);
      currentOffset += entry.length;
    });
    zipFile.set(endOfCentralDirectory, currentOffset);
    const zipBlob = new Blob([zipFile], { type: "application/zip" });
    const link = document.createElement("a");
    link.href = window.URL.createObjectURL(zipBlob);
    link.download = zipFileName;
    link.click();
    return zipBlob;
  }
};

// src/media/file/blob.js
var Blob2 = class _Blob {
  /**
   * Converts a base64-encoded string to a Blob with enhanced error handling and optional progress tracking.
   * @param {string} base64 - The base64-encoded string.
   * @param {string} contentType - The content type of the Blob (e.g., 'image/jpeg').
   * @param {Function} [onProgress] - Optional callback function to track progress (range: 0 to 1).
   * @returns {Blob} - The Blob created from the base64 string.
   */
  static convertBase64ToBlob(base64, contentType, onProgress = null) {
    try {
      const byteCharacters = atob(base64);
      const byteNumbers = new Array(byteCharacters.length);
      for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
        if (onProgress) onProgress(i / byteCharacters.length);
      }
      const byteArray = new Uint8Array(byteNumbers);
      return new _Blob([byteArray], { type: contentType });
    } catch (error) {
      throw new Error(`Failed to convert base64 to Blob: ${error.message}`);
    }
  }
  /**
   * Asynchronously converts a Blob to a base64-encoded string, with error handling and optional progress tracking.
   * @param {Blob} blob - The Blob to convert to base64.
   * @param {Function} [onProgress] - Optional callback function to track progress (range: 0 to 1).
   * @returns {Promise<string>} - A promise that resolves to the base64 string.
   */
  static async convertBlobToBase64(blob, onProgress = null) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onprogress = (event) => {
        if (event.lengthComputable && onProgress) {
          onProgress(event.loaded / event.total);
        }
      };
      reader.onloadend = () => resolve(reader.result.split(",")[1]);
      reader.onerror = () => reject(new Error("Failed to convert Blob to base64"));
      reader.readAsDataURL(blob);
    });
  }
  /**
   * Initiates a download of a Blob as a file, supporting optional MIME type fallback.
   * @param {Blob} blob - The Blob to download.
   * @param {string} filename - The name to be given to the downloaded file.
   * @param {string} [fallbackContentType] - Optional fallback content type if the Blob has none.
   */
  static downloadBlob(blob, filename, fallbackContentType = "application/octet-stream") {
    const contentType = blob.type || fallbackContentType;
    const url = URL.createObjectURL(new _Blob([blob], { type: contentType }));
    const link = document.createElement("a");
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }
  /**
   * Converts a plain text string into a Blob with the specified encoding.
   * @param {string} text - The plain text string to convert.
   * @param {string} [encoding='utf-8'] - The character encoding for the text (default: utf-8).
   * @returns {Blob} - The Blob containing the text.
   */
  static textToBlob(text, encoding = "utf-8") {
    const encoder = new TextEncoder(encoding);
    const uint8Array = encoder.encode(text);
    return new _Blob([uint8Array], { type: `text/plain;charset=${encoding}` });
  }
  /**
   * Merges multiple Blobs into a single Blob, with optional custom content type and buffer size.
   * @param {Blob[]} blobs - An array of Blobs to merge.
   * @param {string} [contentType='application/octet-stream'] - The content type of the merged Blob.
   * @param {number} [bufferSize=1024] - Optional buffer size to optimize memory during merge.
   * @returns {Blob} - The merged Blob.
   */
  static mergeBlobs(blobs, contentType = "application/octet-stream", bufferSize = 1024) {
    const blobBuffers = blobs.map((blob) => blob.slice(0, bufferSize));
    return new _Blob(blobBuffers, { type: contentType });
  }
  /**
   * Encrypts the content of a Blob using a given key and returns an encrypted Blob.
   * @param {Blob} blob - The Blob to encrypt.
   * @param {CryptoKey} key - The encryption key (use SubtleCrypto API to generate).
   * @returns {Promise<Blob>} - The encrypted Blob.
   */
  static async encryptBlob(blob, key) {
    const arrayBuffer = await blob.arrayBuffer();
    const iv = window.crypto.getRandomValues(new Uint8Array(12));
    const encryptedData = await window.crypto.subtle.encrypt(
      { name: "AES-GCM", iv },
      key,
      arrayBuffer
    );
    return new _Blob([iv, encryptedData], { type: blob.type });
  }
  /**
   * Decrypts an encrypted Blob using a given key.
   * @param {Blob} encryptedBlob - The encrypted Blob to decrypt.
   * @param {CryptoKey} key - The decryption key.
   * @returns {Promise<Blob>} - The decrypted Blob.
   */
  static async decryptBlob(encryptedBlob, key) {
    const arrayBuffer = await encryptedBlob.arrayBuffer();
    const iv = arrayBuffer.slice(0, 12);
    const encryptedData = arrayBuffer.slice(12);
    const decryptedData = await window.crypto.subtle.decrypt(
      { name: "AES-GCM", iv: new Uint8Array(iv) },
      key,
      encryptedData
    );
    return new _Blob([decryptedData], { type: encryptedBlob.type });
  }
  /**
   * Splits a Blob into smaller chunks.
   * @param {Blob} blob - The Blob to split.
   * @param {number} chunkSize - The size of each chunk in bytes.
   * @returns {Blob[]} - An array of Blob chunks.
   */
  static chunkBlob(blob, chunkSize) {
    const chunks = [];
    let offset2 = 0;
    while (offset2 < blob.size) {
      const chunk = blob.slice(offset2, offset2 + chunkSize);
      chunks.push(chunk);
      offset2 += chunkSize;
    }
    return chunks;
  }
  /**
   * Reads a Blob as text using a specified encoding, with optional error handling.
   * @param {Blob} blob - The Blob to read as text.
   * @param {string} [encoding='utf-8'] - The encoding of the text (default: utf-8).
   * @returns {Promise<string>} - A promise that resolves to the text content of the Blob.
   */
  static async readBlobAsText(blob, encoding = "utf-8") {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.onerror = () => reject(new Error("Failed to read Blob as text"));
      reader.readAsText(blob, encoding);
    });
  }
  /**
   * Verifies if a Blob's size and content type meet specified conditions.
   * @param {Blob} blob - The Blob to verify.
   * @param {Object} conditions - Conditions to check (size, type).
   * @param {number} [conditions.maxSize] - Maximum size allowed for the Blob (in bytes).
   * @param {string[]} [conditions.allowedTypes] - Array of allowed MIME types.
   * @returns {boolean} - True if Blob meets the conditions, false otherwise.
   */
  static verifyBlob(blob, { maxSize, allowedTypes } = {}) {
    if (maxSize && blob.size > maxSize) {
      return false;
    }
    if (allowedTypes && !allowedTypes.includes(blob.type)) {
      return false;
    }
    return true;
  }
  /**
   * Converts a Blob to a hexadecimal string representation.
   * @param {Blob} blob - The Blob to convert.
   * @returns {Promise<string>} - A promise that resolves to the hexadecimal string.
   */
  static async blobToHex(blob) {
    const arrayBuffer = await blob.arrayBuffer();
    const byteArray = new Uint8Array(arrayBuffer);
    const hexString = Array.from(byteArray).map((byte) => byte.toString(16).padStart(2, "0")).join("");
    return hexString;
  }
};

// src/network/URL/url.js
var URLUtility = class {
  /**
   * Parses a query string and returns an object containing the parameters.
   *
   * @param {string} queryString - The query string to parse.
   * @param {boolean} [decode=true] - Whether to decode the parameters.
   * @returns {object} - An object containing key-value pairs of parameters.
   */
  static parseQueryStringParameters(queryString, decode = true) {
    const params = {};
    if (!queryString || typeof queryString !== "string") {
      return params;
    }
    queryString = queryString.startsWith("?") ? queryString.slice(1) : queryString;
    const pairs = queryString.split("&");
    for (const pair of pairs) {
      const [key, value] = pair.split("=");
      const decodedKey = decode ? decodeURIComponent(key) : key;
      const decodedValue = value ? decode ? decodeURIComponent(value) : value : "";
      if (params.hasOwnProperty(decodedKey)) {
        if (Array.isArray(params[decodedKey])) {
          params[decodedKey].push(decodedValue);
        } else {
          params[decodedKey] = [params[decodedKey], decodedValue];
        }
      } else {
        params[decodedKey] = decodedValue;
      }
    }
    return params;
  }
  /**
   * Replaces or adds a query string parameter in a URL.
   *
   * @param {string} url - The URL to modify.
   * @param {string} key - The parameter key to replace or add.
   * @param {string} value - The new value for the parameter.
   * @param {boolean} [encode=true] - Whether to encode the parameter.
   * @returns {string} - The modified URL.
   */
  static replaceQueryStringParameter(url, key, value, encode = true) {
    if (!url || typeof url !== "string") {
      return url;
    }
    const [baseUrl, queryString] = url.split("?");
    const params = {};
    if (queryString) {
      const pairs = queryString.split("&");
      for (const pair of pairs) {
        const [existingKey, existingValue] = pair.split("=");
        const decodedKey = decodeURIComponent(existingKey);
        const decodedValue = existingValue ? decodeURIComponent(existingValue) : "";
        params[decodedKey] = decodedValue;
      }
    }
    const keyToUse = encode ? encodeURIComponent(key) : key;
    const valueToUse = encode ? encodeURIComponent(value) : value;
    params[keyToUse] = valueToUse;
    const newQueryString = Object.entries(params).map(([k, v]) => `${k}=${v}`).join("&");
    return newQueryString ? `${baseUrl}?${newQueryString}` : baseUrl;
  }
  /**
   * Removes a query string parameter from a URL.
   *
   * @param {string} url - The URL to modify.
   * @param {string} key - The parameter key to remove.
   * @returns {string} - The modified URL.
   */
  static removeQueryStringParameter(url, key) {
    if (!url || typeof url !== "string") {
      return url;
    }
    const [baseUrl, queryString] = url.split("?");
    const params = {};
    if (queryString) {
      const pairs = queryString.split("&");
      for (const pair of pairs) {
        const [existingKey, existingValue] = pair.split("=");
        const decodedKey = decodeURIComponent(existingKey);
        const decodedValue = existingValue ? decodeURIComponent(existingValue) : "";
        params[decodedKey] = decodedValue;
      }
      delete params[key];
    }
    const newQueryString = Object.entries(params).map(([k, v]) => `${k}=${v}`).join("&");
    return newQueryString ? `${baseUrl}?${newQueryString}` : baseUrl;
  }
  /**
   * Merges two URLs by combining their components.
   *
   * @param {string} baseURL - The base URL.
   * @param {string} relativeURL - The relative URL to be merged with the base URL.
   * @returns {string} - The merged URL.
   */
  static mergeURL(baseURL, relativeURL) {
    const base = new URL(baseURL);
    const relative = new URL(relativeURL, base);
    relative.search = relative.search || base.search;
    relative.hash = relative.hash || base.hash;
    return relative.href;
  }
  /**
   * Normalizes a URL by removing redundant parts and standardizing the format.
   *
   * @param {string} url - The URL to normalize.
   * @returns {string} - The normalized URL.
   */
  static normalizeURL(url) {
    try {
      const normalized = new URL(url);
      normalized.hash = normalized.hash.replace(/#$/, "");
      return normalized.href;
    } catch (error) {
      console.error("Invalid URL provided for normalization:", error);
      return url;
    }
  }
  /**
   * Extracts and decodes the fragment (hash) portion of a URL.
   *
   * @param {string} url - The URL containing the fragment.
   * @returns {string} - The decoded fragment.
   */
  static extractFragment(url) {
    try {
      const fragment = new URL(url).hash.substring(1);
      return decodeURIComponent(fragment);
    } catch {
      console.error("Failed to extract or decode fragment from URL:", url);
      return "";
    }
  }
  /**
   * Constructs a URL with the specified base, path, and query parameters.
   *
   * @param {string} base - The base URL.
   * @param {string} path - The path to append to the base URL.
   * @param {object} [queryParams={}] - An object of query parameters to add.
   * @returns {string} - The constructed URL.
   */
  static constructURL(base, path = "", queryParams = {}) {
    try {
      const url = new URL(base);
      if (path) url.pathname = path;
      Object.entries(queryParams).forEach(([key, value]) => {
        url.searchParams.set(key, value);
      });
      return url.href;
    } catch (error) {
      console.error("Error constructing URL:", error);
      return "";
    }
  }
};

// src/network/ip/ip.js
var IP = class {
  /**
   * Validates an IPv4 address.
   * @param {string} ip - The IPv4 address to validate.
   * @returns {boolean} - True if the IPv4 address is valid, false otherwise.
   */
  static validateIPv4Address(ip) {
    const ipv4Regex = /^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;
    return ipv4Regex.test(ip);
  }
  /**
   * Validates an IPv6 address.
   * @param {string} ip - The IPv6 address to validate.
   * @returns {boolean} - True if the IPv6 address is valid, false otherwise.
   */
  static validateIPv6Address(ip) {
    const ipv6Regex = /^(::(?:[fF]{4}:))(\d+\.\d+\.\d+\.\d+)$/;
    return ipv6Regex.test(ip);
  }
  /**
   * Converts an IPv4 address to IPv6 format.
   * @param {string} ip - The IPv4 address to convert.
   * @returns {string | null} - The IPv6 address derived from the given IPv4 address, or null if the IPv4 is invalid.
   */
  static convertIPv4ToIPv6(ip) {
    if (!this.validateIPv4Address(ip)) {
      console.error("Invalid IPv4 address provided.");
      return null;
    }
    const segments = ip.split(".").map(Number);
    const hexSegments = segments.map((segment) => segment.toString(16).padStart(2, "0"));
    const ipv6 = `::ffff:${hexSegments.join(":")}`;
    return ipv6;
  }
  /**
   * Converts an IPv6 address to IPv4 format.
   * @param {string} ip - The IPv6 address to convert.
   * @returns {string | null} - The IPv4 address derived from the given IPv6 address, or null if the input is not valid.
   */
  static convertIPv6ToIPv4(ip) {
    if (!this.validateIPv6Address(ip)) {
      console.error("Invalid IPv6 address provided.");
      return null;
    }
    const ipv4Regex = /::ffff:([\da-f]{2}):([\da-f]{2}):([\da-f]{2}):([\da-f]{2})/i;
    const match = ip.match(ipv4Regex);
    if (!match) {
      console.error("Not a valid IPv6-mapped IPv4 address.");
      return null;
    }
    const ipv4Parts = match.slice(1, 5).map((hex) => parseInt(hex, 16));
    const ipv4 = ipv4Parts.join(".");
    return ipv4;
  }
  /**
   * Normalizes an IPv6 address to its full form (e.g., expanding "::" to its full representation).
   * @param {string} ip - The IPv6 address to normalize.
   * @returns {string|null} - The normalized IPv6 address, or null if invalid.
   */
  static normalizeIPv6(ip) {
    if (!this.validateIPv6Address(ip)) return null;
    try {
      const segments = ip.split(":");
      let fullSegments = [];
      segments.forEach((segment) => {
        if (segment === "") {
          const fillLength = 8 - segments.filter((s) => s !== "").length;
          fullSegments.push(...Array(fillLength).fill("0000"));
        } else {
          fullSegments.push(segment.padStart(4, "0"));
        }
      });
      return fullSegments.join(":");
    } catch (e) {
      console.error("Error normalizing IPv6:", e);
      return null;
    }
  }
  /**
   * Determines the version of the given IP address.
   * @param {string} ip - The IP address to check.
   * @returns {4 | 6 | null} - The IP version (4 or 6), or null if invalid.
   */
  static getIPVersion(ip) {
    if (this.validateIPv4Address(ip)) return 4;
    if (this.validateIPv6Address(ip)) return 6;
    return null;
  }
  /**
  * Checks if the provided IP address is private (e.g., from a local network).
  * @param {string} ip - The IP address to check.
  * @returns {boolean} - True if the IP address is private, false otherwise.
  */
  static isPrivateIP(ip) {
    if (!this.validateIPv4Address(ip)) return false;
    const privateRanges = [
      /^10\./,
      // 10.0.0.0 - 10.255.255.255
      /^172\.(1[6-9]|2[0-9]|3[0-1])\./,
      // 172.16.0.0 - 172.31.255.255
      /^192\.168\./
      // 192.168.0.0 - 192.168.255.255
    ];
    return privateRanges.some((range) => range.test(ip));
  }
  /**
  * Retrieves the user's IP address (server-side, Node.js).
  * @param {Request} req - The incoming HTTP request object.
  * @returns {string|null} - The IP address of the user, or null if not found.
  */
  static async getUserIPAddress(req) {
    try {
      const response = await fetch("https://api.ipify.org?format=json");
      const data = await response.json();
      const ip = data.ip;
      if (ip && this.validateIPv4Address(ip)) {
        return ip;
      }
      return null;
    } catch (e) {
      console.error("Error fetching IP address:", e);
      return null;
    }
  }
  /**
   * Generates a random valid IPv4 address.
   * @returns {string} - A random IPv4 address.
   */
  static generateRandomIPv4() {
    return Array(4).fill(0).map(() => Math.floor(Math.random() * 256)).join(".");
  }
  /**
   * Generates a random IPv6 address.
   * @returns {string} - A randomly generated IPv6 address.
   */
  static generateRandomIPv6() {
    const getRandomHex = () => Math.floor(Math.random() * 65536).toString(16);
    const segments = Array.from({ length: 8 }, getRandomHex);
    return segments.join(":");
  }
  /**
   * Validates if a given subnet mask is correct for IPv4.
   * @param {string} mask - The subnet mask to validate.
   * @returns {boolean} - True if the subnet mask is valid, false otherwise.
   */
  static isValidSubnetMask(mask) {
    const validMasks = [
      "255.255.255.255",
      "255.255.255.254",
      "255.255.255.252",
      "255.255.255.248",
      "255.255.255.240",
      "255.255.255.224",
      "255.255.255.192",
      "255.255.255.128",
      "255.255.255.0",
      "255.255.254.0",
      "255.255.252.0",
      "255.255.248.0",
      "255.255.240.0",
      "255.255.224.0",
      "255.255.192.0",
      "255.255.128.0",
      "255.255.0.0",
      "255.254.0.0",
      "255.252.0.0",
      "255.248.0.0",
      "255.240.0.0",
      "255.224.0.0",
      "255.192.0.0",
      "255.128.0.0",
      "255.0.0.0"
    ];
    return validMasks.includes(mask);
  }
  /**
   * Extracts the IP address and subnet mask from CIDR notation.
   * @param {string} cidr - The CIDR notation (e.g., "192.168.0.1/24").
   * @returns {{ ip: string, mask: string } | null} - The extracted IP and subnet mask, or null if invalid.
   */
  static extractFromCIDR(cidr) {
    const cidrRegex = /^([\d\.]+)\/(\d{1,2})$/;
    const match = cidr.match(cidrRegex);
    if (!match || !this.validateIPv4Address(match[1]) || parseInt(match[2]) > 32) return null;
    const ip = match[1];
    const prefixLength = parseInt(match[2]);
    const maskBinary = "1".repeat(prefixLength).padEnd(32, "0");
    const mask = maskBinary.match(/.{8}/g)?.map((bin) => parseInt(bin, 2)).join(".") || "";
    return { ip, mask };
  }
  /**
  * Calculates the network address for a given IP and subnet mask.
  * @param {string} ip - The IP address.
  * @param {string} mask - The subnet mask.
  * @returns {string|null} - The calculated network address, or null if inputs are invalid.
  */
  static calculateNetworkAddress(ip, mask) {
    if (!this.validateIPv4Address(ip) || !this.isValidSubnetMask(mask)) return null;
    const ipSegments = ip.split(".").map(Number);
    const maskSegments = mask.split(".").map(Number);
    const networkAddress = ipSegments.map((segment, i) => segment & maskSegments[i]);
    return networkAddress.join(".");
  }
  /**
   * Checks if two IP addresses are in the same network.
   * @param {string} ip1 - The first IP address.
   * @param {string} ip2 - The second IP address.
   * @param {string} mask - The subnet mask to check with.
   * @returns {boolean} - True if both IPs are in the same network, false otherwise.
   */
  static areIPsInSameNetwork(ip1, ip2, mask) {
    const network1 = this.calculateNetworkAddress(ip1, mask);
    const network2 = this.calculateNetworkAddress(ip2, mask);
    return network1 === network2;
  }
  /**
   * Get the location information based on IP address asynchronously using ipinfo.io.
   * @param {string} ip - The IP address.
   * @param {Function} callback - The callback function to receive the location information.
   */
  static getLocationByIP(ip, callback2) {
    const apiUrl = `https://ipinfo.io/${ip}/json`;
    fetch(apiUrl).then((response) => {
      if (!response.ok) {
        throw new Error("Failed to fetch geolocation information");
      }
      return response.json();
    }).then((data) => {
      const location = {
        latitude: parseFloat(data.loc.split(",")[0]),
        longitude: parseFloat(data.loc.split(",")[1])
      };
      callback2(location);
    }).catch((error) => {
      console.error("Error fetching geolocation information:", error);
      callback2(null);
    });
  }
};

// src/network/serviceWorker/serviceWorker.js
var ServiceWorkerManager = class {
  /**
   * Registers a service worker.
   *
   * @param {string} url - The URL of the service worker script.
   * @param {object} options - Optional registration options.
   * @returns {Promise<ServiceWorkerRegistration>} - A promise that resolves to the service worker registration.
   */
  static registerServiceWorker(url, options = {}) {
    if (!("serviceWorker" in navigator)) {
      throw new Error("Service workers are not supported in this browser.");
    }
    return navigator.serviceWorker.register(url, options).then((registration) => {
      console.log(`Service worker registered with scope: ${registration.scope}`);
      return registration;
    }).catch((error) => {
      console.error(`Service worker registration failed: ${error}`);
      throw error;
    });
  }
  /**
   * Unregisters a service worker by its registration scope.
   *
   * @param {string} scope - The scope of the service worker to unregister.
   * @returns {Promise<boolean>} - A promise that resolves to true if the service worker was unregistered, false otherwise.
   */
  static unregisterServiceWorker(scope) {
    if (!("serviceWorker" in navigator)) {
      throw new Error("Service workers are not supported in this browser.");
    }
    return navigator.serviceWorker.getRegistrations().then((registrations) => {
      const registration = registrations.find((reg) => reg.scope === scope);
      if (registration) {
        return registration.unregister().then((success) => {
          console.log(`Service worker unregistered with scope: ${scope}`);
          return success;
        });
      } else {
        console.warn(`No service worker found with scope: ${scope}`);
        return false;
      }
    }).catch((error) => {
      console.error(`Service worker unregistration failed: ${error}`);
      throw error;
    });
  }
  /**
   * Checks if a service worker is currently active.
   *
   * @param {string} scope - The scope of the service worker to check.
   * @returns {Promise<boolean>} - A promise that resolves to true if the service worker is active, false otherwise.
   */
  static isServiceWorkerActive(scope) {
    if (!("serviceWorker" in navigator)) {
      throw new Error("Service workers are not supported in this browser.");
    }
    return navigator.serviceWorker.getRegistrations().then((registrations) => {
      const registration = registrations.find((reg) => reg.scope === scope);
      return registration && registration.active ? true : false;
    }).catch((error) => {
      console.error(`Failed to check service worker status: ${error}`);
      throw error;
    });
  }
  /**
   * Posts a message to all service workers with a specific scope.
   *
   * @param {string} scope - The scope of the service workers to message.
   * @param {object} message - The message to send.
   * @returns {Promise<void>} - A promise that resolves when all messages have been sent.
   */
  static postMessageToServiceWorkers(scope, message) {
    if (!("serviceWorker" in navigator)) {
      throw new Error("Service workers are not supported in this browser.");
    }
    return navigator.serviceWorker.getRegistrations().then((registrations) => {
      const registrationsInScope = registrations.filter((reg) => reg.scope === scope);
      registrationsInScope.forEach((reg) => {
        if (reg.active) {
          reg.active.postMessage(message);
        }
      });
    }).catch((error) => {
      console.error(`Failed to post message to service workers: ${error}`);
      throw error;
    });
  }
  /**
   * Updates all service workers with a specific scope.
   *
   * @param {string} scope - The scope of the service workers to update.
   * @returns {Promise<void>} - A promise that resolves when all service workers have been updated.
   */
  static updateServiceWorkers(scope) {
    if (!("serviceWorker" in navigator)) {
      throw new Error("Service workers are not supported in this browser.");
    }
    return navigator.serviceWorker.getRegistrations().then((registrations) => {
      const registrationsInScope = registrations.filter((reg) => reg.scope === scope);
      return Promise.all(
        registrationsInScope.map((reg) => reg.update())
      ).then(() => {
        console.log(`All service workers with scope ${scope} have been updated.`);
      });
    }).catch((error) => {
      console.error(`Failed to update service workers: ${error}`);
      throw error;
    });
  }
  /**
   * Retrieves the state of all service workers.
   *
   * @returns {Promise<Array<object>>} - A promise that resolves to an array of objects containing service worker state information.
   */
  static getServiceWorkerStates() {
    if (!("serviceWorker" in navigator)) {
      throw new Error("Service workers are not supported in this browser.");
    }
    return navigator.serviceWorker.getRegistrations().then((registrations) => {
      return registrations.map((reg) => ({
        scope: reg.scope,
        state: reg.active ? "active" : "inactive",
        updateState: reg.waiting ? "waiting" : "updating"
      }));
    }).catch((error) => {
      console.error(`Failed to retrieve service worker states: ${error}`);
      throw error;
    });
  }
};

// src/device/detection/features.js
var DetectFeature = class {
  /**
   * Detects the presence of ad blockers.
   * @returns {boolean} True if an ad blocker is detected, false otherwise.
   */
  static detectAdBlocker() {
    const testAd = document.createElement("div");
    testAd.innerHTML = "&nbsp;";
    testAd.className = "adsbox";
    document.body.appendChild(testAd);
    const isAdBlocked = testAd.offsetHeight === 0;
    document.body.removeChild(testAd);
    return isAdBlocked;
  }
  /**
   * Detects WebGL support in the browser.
   * @returns {boolean} True if WebGL is supported, false otherwise.
   */
  static detectWebGLSupport() {
    try {
      const canvas = document.createElement("canvas");
      const context = canvas.getContext("webgl") || canvas.getContext("experimental-webgl");
      if (context) {
        return true;
      } else {
        return false;
      }
    } catch (error) {
      return false;
    }
  }
  /**
   * Detects WebP image format support.
   * @returns {Promise<boolean>} A promise that resolves to true if WebP is supported, false otherwise.
   */
  static detectWebP() {
    return new Promise((resolve) => {
      const img = new Image();
      img.onload = function() {
        resolve(true);
      };
      img.onerror = function() {
        resolve(false);
      };
      img.src = "data:image/webp;base64,UklGRh4AAABXRUJQVlA4IBYAAAAwAQCdASoBAAEAAAB5IHpF5GAAAABJ6AA/AJYAAQAAAP8AAAABAAABAAEAAAABAAAAAQAAAAEAAAABAAgAAwAAPwAA";
      img.style.display = "none";
    });
  }
  /**
   * Detects if cookies are enabled in the browser.
   * @returns {boolean} True if cookies are enabled, false otherwise.
   */
  static detectCookiesEnabled() {
    const testCookieName = "testCookie";
    const testCookieValue = "testValue";
    document.cookie = `${testCookieName}=${testCookieValue}; path=/`;
    const cookiesEnabled = document.cookie.indexOf(testCookieName + "=" + testCookieValue) !== -1;
    document.cookie = `${testCookieName}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/`;
    return cookiesEnabled;
  }
  /**
   * Detects if the Do Not Track (DNT) header is enabled.
   * @returns {boolean} True if Do Not Track is enabled, false otherwise.
   */
  static detectDoNotTrack() {
    if (navigator.doNotTrack === "1" || window.doNotTrack === "1") {
      return true;
    } else {
      return false;
    }
  }
  /**
   * Detects if local storage is supported in the browser.
   * @returns {boolean} True if local storage is supported, false otherwise.
   */
  static detectLocalStorage() {
    try {
      const testKey = "__testKey__";
      localStorage.setItem(testKey, "testValue");
      localStorage.removeItem(testKey);
      return true;
    } catch (e) {
      return false;
    }
  }
  /**
   * Detects if session storage is supported in the browser.
   * @returns {boolean} True if session storage is supported, false otherwise.
   */
  static detectSessionStorage() {
    try {
      const testKey = "__testKey__";
      sessionStorage.setItem(testKey, "testValue");
      sessionStorage.removeItem(testKey);
      return true;
    } catch (e) {
      return false;
    }
  }
  /**
   * Detects if WebSockets are supported in the browser.
   * @returns {boolean} True if WebSockets are supported, false otherwise.
   */
  static detectWebSockets() {
    return "WebSocket" in window || "MozWebSocket" in window;
  }
  /**
   * Detects if SVG support is available in the browser.
   * @returns {boolean} True if SVG is supported, false otherwise.
   */
  static detectSVGSupport() {
    return document.implementation.hasFeature("http://www.w3.org/TR/SVG11/feature#BasicStructure", "1.1");
  }
  /**
   * Detects if inline SVG support is available in the browser.
   * @returns {boolean} True if inline SVG is supported, false otherwise.
   */
  static detectInlineSVGSupport() {
    const div = document.createElement("div");
    div.innerHTML = "<svg></svg>";
    return div.firstChild && div.firstChild.namespaceURI === "http://www.w3.org/2000/svg";
  }
  /**
   * Detects if Canvas is supported in the browser.
   * @returns {boolean} True if Canvas is supported, false otherwise.
   */
  static detectCanvasSupport() {
    const canvas = document.createElement("canvas");
    return !!(canvas.getContext && canvas.getContext("2d"));
  }
  /**
   * Detects audio format support in the browser.
   * @returns {boolean} True if audio format is supported, false otherwise.
   */
  static detectAudioFormatSupport() {
    const audio = document.createElement("audio");
    return !!(audio.canPlayType && audio.canPlayType("audio/mpeg;").replace(/no/, ""));
  }
  /**
   * Detects video format support in the browser.
   * @returns {boolean} True if video format is supported, false otherwise.
   */
  static detectVideoFormatSupport() {
    const video = document.createElement("video");
    return !!(video.canPlayType && video.canPlayType("video/mp4;").replace(/no/, ""));
  }
  /**
   * Detects Speech Recognition API support in the browser.
   *
   * @returns {boolean} True if Speech Recognition API is supported, false otherwise.
   */
  static detectSpeechRecognitionAPI() {
    return "SpeechRecognition" in window || "webkitSpeechRecognition" in window;
  }
  /**
   * Detects WebRTC support in the browser.
   *
   * @returns {boolean} True if WebRTC is supported, false otherwise.
   */
  static detectWebRTC() {
    return "RTCPeerConnection" in window || "mozRTCPeerConnection" in window || "webkitRTCPeerConnection" in window;
  }
  /**
   * Detects Retina Display support in the browser.
   * @returns {boolean} True if Retina Display is supported, false otherwise.
   */
  static detectRetinaDisplay() {
    return window.devicePixelRatio && window.devicePixelRatio > 1;
  }
  /**
   * Detects Fullscreen API support in the browser.
   * @returns {boolean} True if Fullscreen API is supported, false otherwise.
   */
  static detectFullscreenAPI() {
    return "fullscreenEnabled" in document || "webkitFullscreenEnabled" in document || "mozFullScreenEnabled" in document;
  }
  /**
   * Detects Orientation API support in the browser.
   * @returns {boolean} True if Orientation API is supported, false otherwise.
   */
  static detectOrientationAPI() {
    return "orientation" in window || "onorientationchange" in window;
  }
  /**
   * Detects Gamepad API support in the browser.
   * @returns {boolean} True if Gamepad API is supported, false otherwise.
   */
  static detectGamepadAPI() {
    return "getGamepads" in navigator || "webkitGetGamepads" in navigator;
  }
  /**
   * Detects FileSystem API support in the browser.
   * @returns {boolean} True if FileSystem API is supported, false otherwise.
   */
  static detectFileSystemAPI() {
    return "requestFileSystem" in window || "webkitRequestFileSystem" in window;
  }
  /**
   * Detects Pointer Lock API support in the browser.
   * @returns {boolean} True if Pointer Lock API is supported, false otherwise.
   */
  static detectPointerLockAPI() {
    return "pointerLockElement" in document || "mozPointerLockElement" in document || "webkitPointerLockElement" in document;
  }
  /**
   * Detects Media Source Extensions support in the browser.
   * @returns {boolean} True if Media Source Extensions are supported, false otherwise.
   */
  static detectMediaSourceExtensions() {
    return "MediaSource" in window && "SourceBuffer" in window;
  }
  /**
   * Detects Picture-in-Picture API support in the browser.
   * @returns {boolean} True if Picture-in-Picture API is supported, false otherwise.
   */
  static detectPictureInPictureAPI() {
    return "pictureInPictureEnabled" in document || "webkitPictureInPictureEnabled" in document;
  }
  /**
   * Detects WebP image format support using modern APIs.
   * @returns {boolean} True if WebP image format is supported, false otherwise.
   */
  static detectWebPImageSupport() {
    const img = new Image();
    return "isImageBitmap" in window && "createImageBitmap" in window.ImageBitmap && "decode" in img;
  }
  /**
   * Detects Page Visibility API support in the browser.
   * @returns {boolean} True if Page Visibility API is supported, false otherwise.
   */
  static detectPageVisibilityAPI() {
    return "hidden" in document || "webkitHidden" in document;
  }
  /**
   * Detects Audio Context API support in the browser.
   * @returns {boolean} True if Audio Context API is supported, false otherwise.
   */
  static detectAudioContextAPI() {
    return "AudioContext" in window || "webkitAudioContext" in window;
  }
  /**
   * Detects WebGL 2.0 API support in the browser.
   * @returns {boolean} True if WebGL 2.0 API is supported, false otherwise.
   */
  static detectWebGL2API() {
    const canvas = document.createElement("canvas");
    return "WebGL2RenderingContext" in window && canvas.getContext("webgl2");
  }
  /**
   * Detects Gamepad Haptic API support in the browser.
   * @returns {boolean} True if Gamepad Haptic API is supported, false otherwise.
   */
  static detectGamepadHapticAPI() {
    return "getGamepads" in navigator && "vibrationActuator" in navigator.getGamepads()[0];
  }
};

// src/device/detection/device.js
var DetectDevice = class {
  /**
   * Detect the user's browser information.
   * @returns {string} - The detected browser name.
   */
  static detectBrowser() {
    const userAgent = navigator.userAgent.toLowerCase();
    if (userAgent.includes("chrome") && !userAgent.includes("edge")) {
      return "Chrome";
    } else if (userAgent.includes("firefox")) {
      return "Firefox";
    } else if (userAgent.includes("safari") && !userAgent.includes("chrome")) {
      return "Safari";
    } else if (userAgent.includes("edge") || userAgent.includes("edg")) {
      return "Edge";
    } else if (userAgent.includes("msie") || userAgent.includes("trident")) {
      return "IE";
    } else if (userAgent.includes("opera") || userAgent.includes("opr")) {
      return "Opera";
    }
    return "Unknown Browser type!";
  }
  /**
   * Detect the user's operating system.
   * @returns {string} - The detected operating system.
   */
  static detectOS() {
    const userAgent = navigator.userAgent.toLowerCase();
    if (userAgent.includes("win")) {
      return "Windows";
    } else if (userAgent.includes("mac")) {
      return "Mac OS";
    } else if (userAgent.includes("iphone") || userAgent.includes("ipad")) {
      return "iOS";
    } else if (userAgent.includes("android")) {
      return "Android";
    } else if (userAgent.includes("linux")) {
      return "Linux";
    }
    return "Unknown OS";
  }
  /**
   * Detects whether the browser is running in a mobile environment.
   * @returns {boolean} - True if the browser is in a mobile environment, false otherwise.
   */
  static isMobileBrowser() {
    const userAgent = navigator.userAgent.toLowerCase();
    return /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(userAgent);
  }
  /**
   * Detect if the user is using a mobile device.
   * @returns {boolean} - True if the user is on a mobile device, false otherwise.
   */
  static detectMobileDevice() {
    const userAgent = navigator.userAgent.toLowerCase();
    return userAgent.includes("mobile") || userAgent.includes("android") || userAgent.includes("iphone");
  }
  /**
   * Detect if the user is using a touch device.
   * @returns {boolean} - True if the user is on a touch device, false otherwise.
   */
  static detectTouchDevice() {
    return "ontouchstart" in window || navigator.maxTouchPoints > 0 || navigator.msMaxTouchPoints > 0;
  }
  /**
   * Detect the user's device type (desktop, tablet, mobile).
   * @returns {string} - The detected device type ("desktop", "tablet", "mobile").
   */
  static detectDeviceType() {
    const userAgent = navigator.userAgent.toLowerCase();
    if (userAgent.includes("mobile") || userAgent.includes("android") || userAgent.includes("iphone")) {
      return "mobile";
    } else if (userAgent.includes("tablet") || userAgent.includes("ipad")) {
      return "tablet";
    } else {
      return "desktop";
    }
  }
  /**
   * Detect the user's preferred language.
   * @returns {string} - The detected language code (e.g., "en" for English).
   */
  static detectLanguage() {
    return navigator.language || navigator.userLanguage || navigator.browserLanguage || navigator.systemLanguage || "";
  }
  /**
   * Detect the user's time zone.
   * @returns {string} - The detected time zone (e.g., "America/New_York").
   */
  static detectTimeZone() {
    try {
      return Intl.DateTimeFormat().resolvedOptions().timeZone;
    } catch (error) {
      console.error("Error detecting time zone:", error);
      return "";
    }
  }
};

// src/device/detection/envInfo.js
var EnvInfo = class {
  /**
   * Get the browser window size.
   * @returns {Object} - An object with 'width' and 'height' properties representing the window size.
   */
  static getBrowserWindowSize() {
    return {
      width: window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth,
      height: window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight
    };
  }
  /**
   * Get the screen resolution.
   * @returns {Object} - An object with 'width' and 'height' properties representing the screen resolution.
   */
  static getScreenResolution() {
    return {
      width: screen.width,
      height: screen.height
    };
  }
  /**
   * Get the battery status asynchronously.
   * @param {Function} callback - The callback function to receive the battery status.
   */
  static getBatteryStatus(callback2) {
    if ("navigator" in window && "getBattery" in navigator) {
      navigator.getBattery().then((battery) => {
        callback2({
          level: battery.level,
          charging: battery.charging,
          chargingTime: battery.chargingTime,
          dischargingTime: battery.dischargingTime
        });
      });
    } else {
      callback2(null);
    }
  }
  /**
   * Get the network status asynchronously.
   * @param {Function} callback - The callback function to receive the network status.
   */
  static getNetworkStatus(callback2) {
    if ("onLine" in navigator) {
      callback2(navigator.onLine);
    } else {
      callback2(null);
    }
  }
  /**
   * Get the device orientation asynchronously.
   * @param {Function} callback - The callback function to receive the device orientation.
   */
  static getDeviceOrientation(callback2) {
    if (DetectFeature.detectOrientationAPI()) {
      window.addEventListener("deviceorientation", (event) => {
        callback2({
          alpha: event.alpha,
          beta: event.beta,
          gamma: event.gamma
        });
      });
    } else {
      callback2(null);
    }
  }
  /**
   * Get the device motion asynchronously.
   * @param {Function} callback - The callback function to receive the device motion.
   */
  static getDeviceMotion(callback2) {
    if ("DeviceMotionEvent" in window) {
      window.addEventListener("devicemotion", (event) => {
        callback2({
          acceleration: event.acceleration,
          accelerationIncludingGravity: event.accelerationIncludingGravity,
          rotationRate: event.rotationRate
        });
      });
    } else {
      callback2(null);
    }
  }
  /**
   * Get the available media devices asynchronously.
   * @param {Function} callback - The callback function to receive the media devices.
   */
  static getMediaDevices(callback2) {
    if ("navigator" in window && "mediaDevices" in navigator) {
      navigator.mediaDevices.enumerateDevices().then((devices) => {
        callback2(devices);
      }).catch(() => {
        callback2(null);
      });
    } else {
      callback2(null);
    }
  }
  /**
   * Get the geolocation asynchronously.
   * @param {Function} callback - The callback function to receive the geolocation.
   */
  static getGeolocation(callback2) {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition((position) => {
        callback2({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude
        });
      }, () => {
        callback2(null);
      });
    } else {
      callback2(null);
    }
  }
};

// src/device/storage/browser-storage.js
var BrowserStorage = class {
  /**
   * Sets a key-value pair in local storage with optional expiration.
   *
   * @param {string} key - The key for the storage item.
   * @param {string} value - The value to be stored.
   * @param {number} [expiresIn] - Optional expiration time in milliseconds.
   */
  static setLocal(key, value, expiresIn) {
    const data = { value };
    if (expiresIn) {
      data.expiresAt = Date.now() + expiresIn;
    }
    localStorage.setItem(key, JSON.stringify(data));
  }
  /**
   * Gets the value associated with a key from local storage, considering expiration.
   *
   * @param {string} key - The key for the storage item.
   * @returns {string|null} - The stored value or null if the key is not found or expired.
   */
  static getLocal(key) {
    const item = localStorage.getItem(key);
    if (item) {
      const data = JSON.parse(item);
      if (data.expiresAt && Date.now() > data.expiresAt) {
        localStorage.removeItem(key);
        return null;
      }
      return data.value;
    }
    return null;
  }
  /**
   * Sets a key-value pair in session storage with optional expiration.
   *
   * @param {string} key - The key for the storage item.
   * @param {string} value - The value to be stored.
   * @param {number} [expiresIn] - Optional expiration time in milliseconds.
   */
  static setSession(key, value, expiresIn) {
    const data = { value };
    if (expiresIn) {
      data.expiresAt = Date.now() + expiresIn;
    }
    sessionStorage.setItem(key, JSON.stringify(data));
  }
  /**
   * Gets the value associated with a key from session storage, considering expiration.
   *
   * @param {string} key - The key for the storage item.
   * @returns {string|null} - The stored value or null if the key is not found or expired.
   */
  static getSession(key) {
    const item = sessionStorage.getItem(key);
    if (item) {
      const data = JSON.parse(item);
      if (data.expiresAt && Date.now() > data.expiresAt) {
        sessionStorage.removeItem(key);
        return null;
      }
      return data.value;
    }
    return null;
  }
  /**
   * Checks if a key exists in local storage.
   *
   * @param {string} key - The key to check for existence.
   * @returns {boolean} - True if the key exists, false otherwise.
   */
  static isLocalKeyExists(key) {
    return this.getLocal(key) !== null;
  }
  /**
   * Checks if a key exists in session storage.
   *
   * @param {string} key - The key to check for existence.
   * @returns {boolean} - True if the key exists, false otherwise.
   */
  static isSessionKeyExists(key) {
    return this.getSession(key) !== null;
  }
  /**
   * Retrieves all keys stored in local storage.
   *
   * @returns {Array<string>} - An array containing all keys in local storage.
   */
  static getAllLocalKeys() {
    return Array.from({ length: localStorage.length }, (_, i) => localStorage.key(i));
  }
  /**
   * Retrieves all keys stored in session storage.
   *
   * @returns {Array<string>} - An array containing all keys in session storage.
   */
  static getAllSessionKeys() {
    return Array.from({ length: sessionStorage.length }, (_, i) => sessionStorage.key(i));
  }
  /**
   * Retrieves all values stored in local storage.
   *
   * @returns {Array<string>} - An array containing all values in local storage.
   */
  static getAllLocalValues() {
    return Array.from({ length: localStorage.length }, (_, i) => localStorage.getItem(localStorage.key(i)));
  }
  /**
   * Retrieves all values stored in session storage.
   *
   * @returns {Array<string>} - An array containing all values in session storage.
   */
  static getAllSessionValues() {
    return Array.from({ length: sessionStorage.length }, (_, i) => sessionStorage.getItem(sessionStorage.key(i)));
  }
  /**
   * Retrieves all key-value pairs stored in local storage.
   *
   * @returns {Object} - An object containing all key-value pairs in local storage.
   */
  static getAllLocalItems() {
    return Array.from({ length: localStorage.length }, (_, i) => {
      const key = localStorage.key(i);
      return { [key]: this.getLocal(key) };
    }).reduce((acc, item) => ({ ...acc, ...item }), {});
  }
  /**
   * Retrieves all key-value pairs stored in session storage.
   *
   * @returns {Object} - An object containing all key-value pairs in session storage.
   */
  static getAllSessionItems() {
    return Array.from({ length: sessionStorage.length }, (_, i) => {
      const key = sessionStorage.key(i);
      return { [key]: this.getSession(key) };
    }).reduce((acc, item) => ({ ...acc, ...item }), {});
  }
  /**
   * Synchronizes local storage with a given object. Adds new entries, updates existing ones, and removes obsolete ones.
   *
   * @param {Object} data - An object containing key-value pairs to sync with local storage.
   * @param {boolean} [merge=false] - If true, merge with existing local storage data instead of replacing.
   * @returns {void}
   */
  static syncLocalStorage(data, merge = false) {
    if (merge) {
      for (const [key, value] of Object.entries(data)) {
        this.setLocal(key, value);
      }
    } else {
      this.clearLocal();
      for (const [key, value] of Object.entries(data)) {
        this.setLocal(key, value);
      }
    }
  }
  /**
   * Syncs session storage with a given object. Adds new entries, updates existing ones, and removes obsolete ones.
   *
   * @param {Object} data - An object containing key-value pairs to sync with session storage.
   * @param {boolean} [merge=false] - If true, merge with existing session storage data instead of replacing.
   * @returns {void}
   */
  static syncSessionStorage(data, merge = false) {
    if (merge) {
      for (const [key, value] of Object.entries(data)) {
        this.setSession(key, value);
      }
    } else {
      this.clearSession();
      for (const [key, value] of Object.entries(data)) {
        this.setSession(key, value);
      }
    }
  }
  /**
   * Performs a batch operation on local storage, executing a function on each key-value pair.
   *
   * @param {Function} callback - A function to execute on each key-value pair. Receives key and value as arguments.
   * @returns {void}
   */
  static batchProcessLocalStorage(callback2) {
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      callback2(key, this.getLocal(key));
    }
  }
  /**
   * Performs a batch operation on session storage, executing a function on each key-value pair.
   *
   * @param {Function} callback - A function to execute on each key-value pair. Receives key and value as arguments.
   * @returns {void}
   */
  static batchProcessSessionStorage(callback2) {
    for (let i = 0; i < sessionStorage.length; i++) {
      const key = sessionStorage.key(i);
      callback2(key, this.getSession(key));
    }
  }
};

// src/device/storage/device-storage.js
var DeviceStorage = class {
  /**
   * Get the total storage capacity of the device.
   * @returns {Promise<{bytes: number, humanReadable: string}>} - A promise that resolves with the total storage capacity in bytes and a human-readable format.
   */
  static async getTotalStorageCapacity() {
    const storageInfo = await navigator.storage.estimate();
    return {
      bytes: storageInfo.quota,
      readable: this.bytesToHumanReadable(storageInfo.quota)
    };
  }
  /**
   * Get the used storage space on the device.
   * @returns {Promise<{bytes: number, humanReadable: string}>} - A promise that resolves with the used storage space in bytes and a human-readable format.
   */
  static async getUsedStorageSpace() {
    const storageInfo = await navigator.storage.estimate();
    return {
      bytes: storageInfo.usage,
      readable: this.bytesToHumanReadable(storageInfo.usage)
    };
  }
  /**
   * Get the available storage space on the device.
   * @returns {Promise<{bytes: number, humanReadable: string}>} - A promise that resolves with the available storage space in bytes and a human-readable format.
   */
  static async getAvailableStorageSpace() {
    const storageInfo = await navigator.storage.estimate();
    const availableSpace = storageInfo.quota - storageInfo.usage;
    return {
      bytes: availableSpace,
      readable: this.bytesToHumanReadable(availableSpace)
    };
  }
  /**
   * Check if there is enough free space on the device for a given amount.
   * @param {number} requiredSpace - The required space in bytes.
   * @returns {Promise<{hasEnough: boolean, availableSpace: {bytes: number, humanReadable: string}}>} - A promise that resolves with a boolean indicating if there is enough free space and details about available space.
   */
  static async hasEnoughFreeSpace(requiredSpace) {
    const availableSpaceInfo = await this.getAvailableStorageSpace();
    return {
      hasEnough: availableSpaceInfo.bytes >= requiredSpace,
      availableSpace: availableSpaceInfo
    };
  }
  /**
   * Get the storage type of the device (e.g., 'temporary', 'persistent').
   * @returns {Promise<string>} - A promise that resolves with the storage type.
   */
  static async getStorageType() {
    const persisted = await navigator.storage.persisted();
    return persisted ? "persistent" : "temporary";
  }
  /**
   * Request persistent storage on the device.
   * @returns {Promise<boolean>} - A promise that resolves with a boolean indicating if the request was successful.
   */
  static async requestPersistentStorage() {
    if (navigator.storage && navigator.storage.persist) {
      const granted = await navigator.storage.persist();
      return granted === true;
    }
    return false;
  }
  /**
   * Get the default quota for persistent storage.
   * @returns {Promise<{quota: number, humanReadable: string}>} - A promise that resolves with the default quota for persistent storage in bytes and a human-readable format.
   */
  static async getDefaultPersistentStorageQuota() {
    const persisted = await navigator.storage.persisted();
    if (persisted) {
      return {
        quota: await navigator.storage.persist(),
        readable: "Persistent storage is granted with no specific quota"
      };
    }
    return {
      quota: -1,
      readable: "Persistent storage is not granted"
    };
  }
  /**
   * Convert bytes to a human-readable format.
   * @param {number} bytes - The size in bytes.
   * @returns {string} - The size in a human-readable format.
   */
  static bytesToHumanReadable(bytes) {
    if (bytes === 0) return "0 Bytes";
    const sizes = ["Bytes", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"];
    const i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)));
    return Math.round(bytes / Math.pow(1024, i), 2) + " " + sizes[i];
  }
};

// src/device/browser-api/device-api.js
var DeviceAPIs = class {
  /**
   * Request a Bluetooth device and return it.
   * @param {object} filters - Filters to match the device.
   * @returns {Promise<BluetoothDevice>} - A promise that resolves with the Bluetooth device.
   */
  static async requestBluetoothDevice(filters = []) {
    if (!("bluetooth" in navigator)) {
      throw new Error("Bluetooth API is not supported.");
    }
    try {
      return await navigator.bluetooth.requestDevice({ filters });
    } catch (error) {
      throw new Error(`Bluetooth device request failed: ${error.message}`);
    }
  }
  /**
   * Request a USB device and return it.
   * @returns {Promise<USBDevice>} - A promise that resolves with the USB device.
   */
  static async requestUSBDevice() {
    if (!("usb" in navigator)) {
      throw new Error("USB API is not supported.");
    }
    try {
      return await navigator.usb.requestDevice({ filters: [] });
    } catch (error) {
      throw new Error(`USB device request failed: ${error.message}`);
    }
  }
  /**
   * Get the current WiFi status (mocked as WiFi API is not standardized yet).
   * @returns {Promise<string>} - A promise that resolves with the WiFi status.
   */
  static async getWiFiStatus() {
    if (!("wifi" in navigator)) {
      throw new Error("WiFi API is not supported.");
    }
    return "WiFi status retrieval is not available in standard API.";
  }
  /**
   * Synthesize speech from text.
   * @param {string} text - The text to synthesize.
   * @param {object} [options] - Optional settings for the speech synthesis.
   * @returns {void}
   */
  static synthesizeSpeech(text, options = {}) {
    if (!("speechSynthesis" in window)) {
      throw new Error("Speech Synthesis API is not supported.");
    }
    const utterance = new SpeechSynthesisUtterance(text);
    for (const [key, value] of Object.entries(options)) {
      if (utterance[key] !== void 0) {
        utterance[key] = value;
      }
    }
    window.speechSynthesis.speak(utterance);
  }
  /**
   * Checks if the Clipboard API is available.
   * @returns {boolean} - True if the Clipboard API is available.
   */
  static isClipboardSupported() {
    return navigator.clipboard && "writeText" in navigator.clipboard;
  }
  /**
   * Write text to the clipboard.
   * @param {string} text - The text to write to the clipboard.
   * @returns {Promise<void>} - A promise that resolves when the text is written.
   */
  static async writeToClipboard(text) {
    if (!this.isClipboardSupported()) {
      throw new Error("Clipboard API is not supported.");
    }
    try {
      await navigator.clipboard.writeText(text);
    } catch (error) {
      throw new Error(`Failed to write to clipboard: ${error.message}`);
    }
  }
  /**
   * Read text from the clipboard.
   * @returns {Promise<string>} - A promise that resolves with the text from the clipboard.
   */
  static async readFromClipboard() {
    if (!this.isClipboardSupported()) {
      throw new Error("Clipboard API is not supported.");
    }
    try {
      return await navigator.clipboard.readText();
    } catch (error) {
      throw new Error(`Failed to read from clipboard: ${error.message}`);
    }
  }
};

// src/index.js
var Butility = {
  Element,
  Attribute,
  Obj,
  String,
  Scroll,
  Utility,
  Ripple,
  RippleEffect,
  DragDrop,
  Style,
  Color,
  Modal,
  Tooltip,
  Validate,
  FormAction,
  SerializeForm,
  File,
  Blob: Blob2,
  Image: Image2,
  Capture,
  FullScreen,
  IP,
  RequestServer,
  URLUtility,
  ServiceWorkerManager,
  DetectDevice,
  DetectFeature,
  EnvInfo,
  DeviceStorage,
  BrowserStorage,
  DeviceAPIs
};
var src_default = Butility;
export {
  Attribute,
  Blob2 as Blob,
  BrowserStorage,
  Capture,
  Color,
  DetectDevice,
  DetectFeature,
  DeviceAPIs,
  DeviceStorage,
  DragDrop,
  Element,
  EnvInfo,
  File,
  FormAction,
  FullScreen,
  IP,
  Image2 as Image,
  Modal,
  Obj,
  RequestServer,
  Ripple,
  RippleEffect,
  Scroll,
  SerializeForm,
  ServiceWorkerManager,
  String,
  Style,
  Tooltip,
  URLUtility,
  Utility,
  Validate,
  src_default as default
};
/**
 * @author - Ermiyas Arage
 * @license MIT
 */
