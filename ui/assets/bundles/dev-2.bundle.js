(window["webpackJsonp"] = window["webpackJsonp"] || []).push([[2],{

/***/ "./node_modules/u2f-api-polyfill/u2f-api-polyfill.js":
/*!***********************************************************!*\
  !*** ./node_modules/u2f-api-polyfill/u2f-api-polyfill.js ***!
  \***********************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("//Copyright 2014-2015 Google Inc. All rights reserved.\n\n//Use of this source code is governed by a BSD-style\n//license that can be found in the LICENSE file or at\n//https://developers.google.com/open-source/licenses/bsd\n\n// NOTE FROM MAINTAINER: This file is copied from google/u2f-ref-code with as\n// few alterations as possible. Any changes that were necessary are annotated\n// with \"NECESSARY CHANGE\". These changes, as well as this note, should be\n// preserved when updating this file from the source.\n\n/**\n * @fileoverview The U2F api.\n */\n\n\n// NECESSARY CHANGE: wrap the whole file in a closure\n(function (){\n  // NECESSARY CHANGE: detect UA to avoid clobbering other browser's U2F API.\n  var isChrome = 'chrome' in window && window.navigator.userAgent.indexOf('Edge') < 0;\n  if ('u2f' in window || !isChrome) {\n    return;\n  }\n\n  /**\n   * Namespace for the U2F api.\n   * @type {Object}\n   */\n  // NECESSARY CHANGE: define the window.u2f API.\n  var u2f = window.u2f = {};\n\n  /**\n   * FIDO U2F Javascript API Version\n   * @number\n   */\n  var js_api_version;\n\n  /**\n   * The U2F extension id\n   * @const {string}\n   */\n  // The Chrome packaged app extension ID.\n  // Uncomment this if you want to deploy a server instance that uses\n  // the package Chrome app and does not require installing the U2F Chrome extension.\n  u2f.EXTENSION_ID = 'kmendfapggjehodndflmmgagdbamhnfd';\n  // The U2F Chrome extension ID.\n  // Uncomment this if you want to deploy a server instance that uses\n  // the U2F Chrome extension to authenticate.\n  // u2f.EXTENSION_ID = 'pfboblefjcgdjicmnffhdgionmgcdmne';\n\n\n  /**\n   * Message types for messsages to/from the extension\n   * @const\n   * @enum {string}\n   */\n  u2f.MessageTypes = {\n      'U2F_REGISTER_REQUEST': 'u2f_register_request',\n      'U2F_REGISTER_RESPONSE': 'u2f_register_response',\n      'U2F_SIGN_REQUEST': 'u2f_sign_request',\n      'U2F_SIGN_RESPONSE': 'u2f_sign_response',\n      'U2F_GET_API_VERSION_REQUEST': 'u2f_get_api_version_request',\n      'U2F_GET_API_VERSION_RESPONSE': 'u2f_get_api_version_response'\n  };\n\n\n  /**\n   * Response status codes\n   * @const\n   * @enum {number}\n   */\n  u2f.ErrorCodes = {\n      'OK': 0,\n      'OTHER_ERROR': 1,\n      'BAD_REQUEST': 2,\n      'CONFIGURATION_UNSUPPORTED': 3,\n      'DEVICE_INELIGIBLE': 4,\n      'TIMEOUT': 5\n  };\n\n\n  /**\n   * A message for registration requests\n   * @typedef {{\n   *   type: u2f.MessageTypes,\n   *   appId: ?string,\n   *   timeoutSeconds: ?number,\n   *   requestId: ?number\n   * }}\n   */\n  u2f.U2fRequest;\n\n\n  /**\n   * A message for registration responses\n   * @typedef {{\n   *   type: u2f.MessageTypes,\n   *   responseData: (u2f.Error | u2f.RegisterResponse | u2f.SignResponse),\n   *   requestId: ?number\n   * }}\n   */\n  u2f.U2fResponse;\n\n\n  /**\n   * An error object for responses\n   * @typedef {{\n   *   errorCode: u2f.ErrorCodes,\n   *   errorMessage: ?string\n   * }}\n   */\n  u2f.Error;\n\n  /**\n   * Data object for a single sign request.\n   * @typedef {enum {BLUETOOTH_RADIO, BLUETOOTH_LOW_ENERGY, USB, NFC, USB_INTERNAL}}\n   */\n  u2f.Transport;\n\n\n  /**\n   * Data object for a single sign request.\n   * @typedef {Array<u2f.Transport>}\n   */\n  u2f.Transports;\n\n  /**\n   * Data object for a single sign request.\n   * @typedef {{\n   *   version: string,\n   *   challenge: string,\n   *   keyHandle: string,\n   *   appId: string\n   * }}\n   */\n  u2f.SignRequest;\n\n\n  /**\n   * Data object for a sign response.\n   * @typedef {{\n   *   keyHandle: string,\n   *   signatureData: string,\n   *   clientData: string\n   * }}\n   */\n  u2f.SignResponse;\n\n\n  /**\n   * Data object for a registration request.\n   * @typedef {{\n   *   version: string,\n   *   challenge: string\n   * }}\n   */\n  u2f.RegisterRequest;\n\n\n  /**\n   * Data object for a registration response.\n   * @typedef {{\n   *   version: string,\n   *   keyHandle: string,\n   *   transports: Transports,\n   *   appId: string\n   * }}\n   */\n  u2f.RegisterResponse;\n\n\n  /**\n   * Data object for a registered key.\n   * @typedef {{\n   *   version: string,\n   *   keyHandle: string,\n   *   transports: ?Transports,\n   *   appId: ?string\n   * }}\n   */\n  u2f.RegisteredKey;\n\n\n  /**\n   * Data object for a get API register response.\n   * @typedef {{\n   *   js_api_version: number\n   * }}\n   */\n  u2f.GetJsApiVersionResponse;\n\n\n  //Low level MessagePort API support\n\n  /**\n   * Sets up a MessagePort to the U2F extension using the\n   * available mechanisms.\n   * @param {function((MessagePort|u2f.WrappedChromeRuntimePort_))} callback\n   */\n  u2f.getMessagePort = function(callback) {\n    if (typeof chrome != 'undefined' && chrome.runtime) {\n      // The actual message here does not matter, but we need to get a reply\n      // for the callback to run. Thus, send an empty signature request\n      // in order to get a failure response.\n      var msg = {\n          type: u2f.MessageTypes.U2F_SIGN_REQUEST,\n          signRequests: []\n      };\n      chrome.runtime.sendMessage(u2f.EXTENSION_ID, msg, function() {\n        if (!chrome.runtime.lastError) {\n          // We are on a whitelisted origin and can talk directly\n          // with the extension.\n          u2f.getChromeRuntimePort_(callback);\n        } else {\n          // chrome.runtime was available, but we couldn't message\n          // the extension directly, use iframe\n          u2f.getIframePort_(callback);\n        }\n      });\n    } else if (u2f.isAndroidChrome_()) {\n      u2f.getAuthenticatorPort_(callback);\n    } else if (u2f.isIosChrome_()) {\n      u2f.getIosPort_(callback);\n    } else {\n      // chrome.runtime was not available at all, which is normal\n      // when this origin doesn't have access to any extensions.\n      u2f.getIframePort_(callback);\n    }\n  };\n\n  /**\n   * Detect chrome running on android based on the browser's useragent.\n   * @private\n   */\n  u2f.isAndroidChrome_ = function() {\n    var userAgent = navigator.userAgent;\n    return userAgent.indexOf('Chrome') != -1 &&\n    userAgent.indexOf('Android') != -1;\n  };\n\n  /**\n   * Detect chrome running on iOS based on the browser's platform.\n   * @private\n   */\n  u2f.isIosChrome_ = function() {\n    return [\"iPhone\", \"iPad\", \"iPod\"].indexOf(navigator.platform) > -1;\n  };\n\n  /**\n   * Connects directly to the extension via chrome.runtime.connect.\n   * @param {function(u2f.WrappedChromeRuntimePort_)} callback\n   * @private\n   */\n  u2f.getChromeRuntimePort_ = function(callback) {\n    var port = chrome.runtime.connect(u2f.EXTENSION_ID,\n        {'includeTlsChannelId': true});\n    setTimeout(function() {\n      callback(new u2f.WrappedChromeRuntimePort_(port));\n    }, 0);\n  };\n\n  /**\n   * Return a 'port' abstraction to the Authenticator app.\n   * @param {function(u2f.WrappedAuthenticatorPort_)} callback\n   * @private\n   */\n  u2f.getAuthenticatorPort_ = function(callback) {\n    setTimeout(function() {\n      callback(new u2f.WrappedAuthenticatorPort_());\n    }, 0);\n  };\n\n  /**\n   * Return a 'port' abstraction to the iOS client app.\n   * @param {function(u2f.WrappedIosPort_)} callback\n   * @private\n   */\n  u2f.getIosPort_ = function(callback) {\n    setTimeout(function() {\n      callback(new u2f.WrappedIosPort_());\n    }, 0);\n  };\n\n  /**\n   * A wrapper for chrome.runtime.Port that is compatible with MessagePort.\n   * @param {Port} port\n   * @constructor\n   * @private\n   */\n  u2f.WrappedChromeRuntimePort_ = function(port) {\n    this.port_ = port;\n  };\n\n  /**\n   * Format and return a sign request compliant with the JS API version supported by the extension.\n   * @param {Array<u2f.SignRequest>} signRequests\n   * @param {number} timeoutSeconds\n   * @param {number} reqId\n   * @return {Object}\n   */\n  u2f.formatSignRequest_ =\n    function(appId, challenge, registeredKeys, timeoutSeconds, reqId) {\n    if (js_api_version === undefined || js_api_version < 1.1) {\n      // Adapt request to the 1.0 JS API\n      var signRequests = [];\n      for (var i = 0; i < registeredKeys.length; i++) {\n        signRequests[i] = {\n            version: registeredKeys[i].version,\n            challenge: challenge,\n            keyHandle: registeredKeys[i].keyHandle,\n            appId: appId\n        };\n      }\n      return {\n        type: u2f.MessageTypes.U2F_SIGN_REQUEST,\n        signRequests: signRequests,\n        timeoutSeconds: timeoutSeconds,\n        requestId: reqId\n      };\n    }\n    // JS 1.1 API\n    return {\n      type: u2f.MessageTypes.U2F_SIGN_REQUEST,\n      appId: appId,\n      challenge: challenge,\n      registeredKeys: registeredKeys,\n      timeoutSeconds: timeoutSeconds,\n      requestId: reqId\n    };\n  };\n\n  /**\n   * Format and return a register request compliant with the JS API version supported by the extension..\n   * @param {Array<u2f.SignRequest>} signRequests\n   * @param {Array<u2f.RegisterRequest>} signRequests\n   * @param {number} timeoutSeconds\n   * @param {number} reqId\n   * @return {Object}\n   */\n  u2f.formatRegisterRequest_ =\n    function(appId, registeredKeys, registerRequests, timeoutSeconds, reqId) {\n    if (js_api_version === undefined || js_api_version < 1.1) {\n      // Adapt request to the 1.0 JS API\n      for (var i = 0; i < registerRequests.length; i++) {\n        registerRequests[i].appId = appId;\n      }\n      var signRequests = [];\n      for (var i = 0; i < registeredKeys.length; i++) {\n        signRequests[i] = {\n            version: registeredKeys[i].version,\n            challenge: registerRequests[0],\n            keyHandle: registeredKeys[i].keyHandle,\n            appId: appId\n        };\n      }\n      return {\n        type: u2f.MessageTypes.U2F_REGISTER_REQUEST,\n        signRequests: signRequests,\n        registerRequests: registerRequests,\n        timeoutSeconds: timeoutSeconds,\n        requestId: reqId\n      };\n    }\n    // JS 1.1 API\n    return {\n      type: u2f.MessageTypes.U2F_REGISTER_REQUEST,\n      appId: appId,\n      registerRequests: registerRequests,\n      registeredKeys: registeredKeys,\n      timeoutSeconds: timeoutSeconds,\n      requestId: reqId\n    };\n  };\n\n\n  /**\n   * Posts a message on the underlying channel.\n   * @param {Object} message\n   */\n  u2f.WrappedChromeRuntimePort_.prototype.postMessage = function(message) {\n    this.port_.postMessage(message);\n  };\n\n\n  /**\n   * Emulates the HTML 5 addEventListener interface. Works only for the\n   * onmessage event, which is hooked up to the chrome.runtime.Port.onMessage.\n   * @param {string} eventName\n   * @param {function({data: Object})} handler\n   */\n  u2f.WrappedChromeRuntimePort_.prototype.addEventListener =\n      function(eventName, handler) {\n    var name = eventName.toLowerCase();\n    if (name == 'message' || name == 'onmessage') {\n      this.port_.onMessage.addListener(function(message) {\n        // Emulate a minimal MessageEvent object\n        handler({'data': message});\n      });\n    } else {\n      console.error('WrappedChromeRuntimePort only supports onMessage');\n    }\n  };\n\n  /**\n   * Wrap the Authenticator app with a MessagePort interface.\n   * @constructor\n   * @private\n   */\n  u2f.WrappedAuthenticatorPort_ = function() {\n    this.requestId_ = -1;\n    this.requestObject_ = null;\n  }\n\n  /**\n   * Launch the Authenticator intent.\n   * @param {Object} message\n   */\n  u2f.WrappedAuthenticatorPort_.prototype.postMessage = function(message) {\n    var intentUrl =\n      u2f.WrappedAuthenticatorPort_.INTENT_URL_BASE_ +\n      ';S.request=' + encodeURIComponent(JSON.stringify(message)) +\n      ';end';\n    document.location = intentUrl;\n  };\n\n  /**\n   * Tells what type of port this is.\n   * @return {String} port type\n   */\n  u2f.WrappedAuthenticatorPort_.prototype.getPortType = function() {\n    return \"WrappedAuthenticatorPort_\";\n  };\n\n\n  /**\n   * Emulates the HTML 5 addEventListener interface.\n   * @param {string} eventName\n   * @param {function({data: Object})} handler\n   */\n  u2f.WrappedAuthenticatorPort_.prototype.addEventListener = function(eventName, handler) {\n    var name = eventName.toLowerCase();\n    if (name == 'message') {\n      var self = this;\n      /* Register a callback to that executes when\n      * chrome injects the response. */\n      window.addEventListener(\n          'message', self.onRequestUpdate_.bind(self, handler), false);\n    } else {\n      console.error('WrappedAuthenticatorPort only supports message');\n    }\n  };\n\n  /**\n   * Callback invoked  when a response is received from the Authenticator.\n   * @param function({data: Object}) callback\n   * @param {Object} message message Object\n   */\n  u2f.WrappedAuthenticatorPort_.prototype.onRequestUpdate_ =\n      function(callback, message) {\n    var messageObject = JSON.parse(message.data);\n    var intentUrl = messageObject['intentURL'];\n\n    var errorCode = messageObject['errorCode'];\n    var responseObject = null;\n    if (messageObject.hasOwnProperty('data')) {\n      responseObject = /** @type {Object} */ (\n          JSON.parse(messageObject['data']));\n    }\n\n    callback({'data': responseObject});\n  };\n\n  /**\n   * Base URL for intents to Authenticator.\n   * @const\n   * @private\n   */\n  u2f.WrappedAuthenticatorPort_.INTENT_URL_BASE_ =\n    'intent:#Intent;action=com.google.android.apps.authenticator.AUTHENTICATE';\n\n  /**\n   * Wrap the iOS client app with a MessagePort interface.\n   * @constructor\n   * @private\n   */\n  u2f.WrappedIosPort_ = function() {};\n\n  /**\n   * Launch the iOS client app request\n   * @param {Object} message\n   */\n  u2f.WrappedIosPort_.prototype.postMessage = function(message) {\n    var str = JSON.stringify(message);\n    var url = \"u2f://auth?\" + encodeURI(str);\n    location.replace(url);\n  };\n\n  /**\n   * Tells what type of port this is.\n   * @return {String} port type\n   */\n  u2f.WrappedIosPort_.prototype.getPortType = function() {\n    return \"WrappedIosPort_\";\n  };\n\n  /**\n   * Emulates the HTML 5 addEventListener interface.\n   * @param {string} eventName\n   * @param {function({data: Object})} handler\n   */\n  u2f.WrappedIosPort_.prototype.addEventListener = function(eventName, handler) {\n    var name = eventName.toLowerCase();\n    if (name !== 'message') {\n      console.error('WrappedIosPort only supports message');\n    }\n  };\n\n  /**\n   * Sets up an embedded trampoline iframe, sourced from the extension.\n   * @param {function(MessagePort)} callback\n   * @private\n   */\n  u2f.getIframePort_ = function(callback) {\n    // Create the iframe\n    var iframeOrigin = 'chrome-extension://' + u2f.EXTENSION_ID;\n    var iframe = document.createElement('iframe');\n    iframe.src = iframeOrigin + '/u2f-comms.html';\n    iframe.setAttribute('style', 'display:none');\n    document.body.appendChild(iframe);\n\n    var channel = new MessageChannel();\n    var ready = function(message) {\n      if (message.data == 'ready') {\n        channel.port1.removeEventListener('message', ready);\n        callback(channel.port1);\n      } else {\n        console.error('First event on iframe port was not \"ready\"');\n      }\n    };\n    channel.port1.addEventListener('message', ready);\n    channel.port1.start();\n\n    iframe.addEventListener('load', function() {\n      // Deliver the port to the iframe and initialize\n      iframe.contentWindow.postMessage('init', iframeOrigin, [channel.port2]);\n    });\n  };\n\n\n  //High-level JS API\n\n  /**\n   * Default extension response timeout in seconds.\n   * @const\n   */\n  u2f.EXTENSION_TIMEOUT_SEC = 30;\n\n  /**\n   * A singleton instance for a MessagePort to the extension.\n   * @type {MessagePort|u2f.WrappedChromeRuntimePort_}\n   * @private\n   */\n  u2f.port_ = null;\n\n  /**\n   * Callbacks waiting for a port\n   * @type {Array<function((MessagePort|u2f.WrappedChromeRuntimePort_))>}\n   * @private\n   */\n  u2f.waitingForPort_ = [];\n\n  /**\n   * A counter for requestIds.\n   * @type {number}\n   * @private\n   */\n  u2f.reqCounter_ = 0;\n\n  /**\n   * A map from requestIds to client callbacks\n   * @type {Object.<number,(function((u2f.Error|u2f.RegisterResponse))\n   *                       |function((u2f.Error|u2f.SignResponse)))>}\n   * @private\n   */\n  u2f.callbackMap_ = {};\n\n  /**\n   * Creates or retrieves the MessagePort singleton to use.\n   * @param {function((MessagePort|u2f.WrappedChromeRuntimePort_))} callback\n   * @private\n   */\n  u2f.getPortSingleton_ = function(callback) {\n    if (u2f.port_) {\n      callback(u2f.port_);\n    } else {\n      if (u2f.waitingForPort_.length == 0) {\n        u2f.getMessagePort(function(port) {\n          u2f.port_ = port;\n          u2f.port_.addEventListener('message',\n              /** @type {function(Event)} */ (u2f.responseHandler_));\n\n          // Careful, here be async callbacks. Maybe.\n          while (u2f.waitingForPort_.length)\n            u2f.waitingForPort_.shift()(u2f.port_);\n        });\n      }\n      u2f.waitingForPort_.push(callback);\n    }\n  };\n\n  /**\n   * Handles response messages from the extension.\n   * @param {MessageEvent.<u2f.Response>} message\n   * @private\n   */\n  u2f.responseHandler_ = function(message) {\n    var response = message.data;\n    var reqId = response['requestId'];\n    if (!reqId || !u2f.callbackMap_[reqId]) {\n      console.error('Unknown or missing requestId in response.');\n      return;\n    }\n    var cb = u2f.callbackMap_[reqId];\n    delete u2f.callbackMap_[reqId];\n    cb(response['responseData']);\n  };\n\n  /**\n   * Dispatches an array of sign requests to available U2F tokens.\n   * If the JS API version supported by the extension is unknown, it first sends a\n   * message to the extension to find out the supported API version and then it sends\n   * the sign request.\n   * @param {string=} appId\n   * @param {string=} challenge\n   * @param {Array<u2f.RegisteredKey>} registeredKeys\n   * @param {function((u2f.Error|u2f.SignResponse))} callback\n   * @param {number=} opt_timeoutSeconds\n   */\n  u2f.sign = function(appId, challenge, registeredKeys, callback, opt_timeoutSeconds) {\n    if (js_api_version === undefined) {\n      // Send a message to get the extension to JS API version, then send the actual sign request.\n      u2f.getApiVersion(\n          function (response) {\n            js_api_version = response['js_api_version'] === undefined ? 0 : response['js_api_version'];\n            console.log(\"Extension JS API Version: \", js_api_version);\n            u2f.sendSignRequest(appId, challenge, registeredKeys, callback, opt_timeoutSeconds);\n          });\n    } else {\n      // We know the JS API version. Send the actual sign request in the supported API version.\n      u2f.sendSignRequest(appId, challenge, registeredKeys, callback, opt_timeoutSeconds);\n    }\n  };\n\n  /**\n   * Dispatches an array of sign requests to available U2F tokens.\n   * @param {string=} appId\n   * @param {string=} challenge\n   * @param {Array<u2f.RegisteredKey>} registeredKeys\n   * @param {function((u2f.Error|u2f.SignResponse))} callback\n   * @param {number=} opt_timeoutSeconds\n   */\n  u2f.sendSignRequest = function(appId, challenge, registeredKeys, callback, opt_timeoutSeconds) {\n    u2f.getPortSingleton_(function(port) {\n      var reqId = ++u2f.reqCounter_;\n      u2f.callbackMap_[reqId] = callback;\n      var timeoutSeconds = (typeof opt_timeoutSeconds !== 'undefined' ?\n          opt_timeoutSeconds : u2f.EXTENSION_TIMEOUT_SEC);\n      var req = u2f.formatSignRequest_(appId, challenge, registeredKeys, timeoutSeconds, reqId);\n      port.postMessage(req);\n    });\n  };\n\n  /**\n   * Dispatches register requests to available U2F tokens. An array of sign\n   * requests identifies already registered tokens.\n   * If the JS API version supported by the extension is unknown, it first sends a\n   * message to the extension to find out the supported API version and then it sends\n   * the register request.\n   * @param {string=} appId\n   * @param {Array<u2f.RegisterRequest>} registerRequests\n   * @param {Array<u2f.RegisteredKey>} registeredKeys\n   * @param {function((u2f.Error|u2f.RegisterResponse))} callback\n   * @param {number=} opt_timeoutSeconds\n   */\n  u2f.register = function(appId, registerRequests, registeredKeys, callback, opt_timeoutSeconds) {\n    if (js_api_version === undefined) {\n      // Send a message to get the extension to JS API version, then send the actual register request.\n      u2f.getApiVersion(\n          function (response) {\n            js_api_version = response['js_api_version'] === undefined ? 0: response['js_api_version'];\n            console.log(\"Extension JS API Version: \", js_api_version);\n            u2f.sendRegisterRequest(appId, registerRequests, registeredKeys,\n                callback, opt_timeoutSeconds);\n          });\n    } else {\n      // We know the JS API version. Send the actual register request in the supported API version.\n      u2f.sendRegisterRequest(appId, registerRequests, registeredKeys,\n          callback, opt_timeoutSeconds);\n    }\n  };\n\n  /**\n   * Dispatches register requests to available U2F tokens. An array of sign\n   * requests identifies already registered tokens.\n   * @param {string=} appId\n   * @param {Array<u2f.RegisterRequest>} registerRequests\n   * @param {Array<u2f.RegisteredKey>} registeredKeys\n   * @param {function((u2f.Error|u2f.RegisterResponse))} callback\n   * @param {number=} opt_timeoutSeconds\n   */\n  u2f.sendRegisterRequest = function(appId, registerRequests, registeredKeys, callback, opt_timeoutSeconds) {\n    u2f.getPortSingleton_(function(port) {\n      var reqId = ++u2f.reqCounter_;\n      u2f.callbackMap_[reqId] = callback;\n      var timeoutSeconds = (typeof opt_timeoutSeconds !== 'undefined' ?\n          opt_timeoutSeconds : u2f.EXTENSION_TIMEOUT_SEC);\n      var req = u2f.formatRegisterRequest_(\n          appId, registeredKeys, registerRequests, timeoutSeconds, reqId);\n      port.postMessage(req);\n    });\n  };\n\n\n  /**\n   * Dispatches a message to the extension to find out the supported\n   * JS API version.\n   * If the user is on a mobile phone and is thus using Google Authenticator instead\n   * of the Chrome extension, don't send the request and simply return 0.\n   * @param {function((u2f.Error|u2f.GetJsApiVersionResponse))} callback\n   * @param {number=} opt_timeoutSeconds\n   */\n  u2f.getApiVersion = function(callback, opt_timeoutSeconds) {\n  u2f.getPortSingleton_(function(port) {\n    // If we are using Android Google Authenticator or iOS client app,\n    // do not fire an intent to ask which JS API version to use.\n    if (port.getPortType) {\n      var apiVersion;\n      switch (port.getPortType()) {\n        case 'WrappedIosPort_':\n        case 'WrappedAuthenticatorPort_':\n          apiVersion = 1.1;\n          break;\n\n        default:\n          apiVersion = 0;\n          break;\n      }\n      callback({ 'js_api_version': apiVersion });\n      return;\n    }\n      var reqId = ++u2f.reqCounter_;\n      u2f.callbackMap_[reqId] = callback;\n      var req = {\n        type: u2f.MessageTypes.U2F_GET_API_VERSION_REQUEST,\n        timeoutSeconds: (typeof opt_timeoutSeconds !== 'undefined' ?\n            opt_timeoutSeconds : u2f.EXTENSION_TIMEOUT_SEC),\n        requestId: reqId\n      };\n      port.postMessage(req);\n    });\n  };\n})();\n\n\n//# sourceURL=webpack:///./node_modules/u2f-api-polyfill/u2f-api-polyfill.js?");

/***/ })

}]);