/** 
 * ModelProxy
 * As named, this class is provided to model the proxy.
 * @author ShanFan
 * @created 24-3-2014
 **/

// Dependencies
var InterfaceManager = require( './interfacemanager' )
  , ProxyFactory = require( './proxyfactory' );

/**
 * ModelProxy Constructor
 * @param {Object|Array|String} profile. This profile describes what the model looks
 * like. eg:
 * profile = {
 *    getItems: 'Search.getItems',
 *    getCart: 'Cart.getCart'
 * }
 * profile = ['Search.getItems', 'Cart.getCart']
 * profile = 'Search.getItems'
 * profile = 'Search.*'
 */
function ModelProxy( profile ) {
    if ( !profile ) return;

    if ( typeof profile === 'string' ) {

        // Get ids via prefix pattern like 'packageName.*'
        if ( /^(\w+\.)+\*$/.test( profile ) ) {
            profile = ProxyFactory
                .getInterfaceIdsByPrefix( profile.replace( /\*$/, '' ) );

        } else {
            profile = [ profile ];
        }
    }
    if ( profile instanceof Array ) {
        var prof = {}, methodName;
        for ( var i = profile.length - 1; i >= 0; i-- ) {
            methodName = profile[ i ];
            methodName = methodName
                            .substring( methodName.lastIndexOf( '.' ) + 1 );
            if ( !prof[ methodName ] ) {
                prof[ methodName ] = profile[ i ];

            // The method name is duplicated, so the full interface id is set
            // as the method name.
            } else {
                methodName = profile[ i ].replace( /\./g, '_' );
                prof[ methodName ] = profile[ i ]; 
            }
        }
        profile = prof;
    }
    
    // Construct the model following the profile
    for ( var method in profile ) {
        this[ method ] = ( function( methodName, interfaceId ) {
            var proxy = ProxyFactory.create( interfaceId );
            return function( params ) {
                params = params || {};

                if ( !this._queue ) {
                    this._queue = [];
                }
                // Push this method call into request queue. Once the done method
                // is called, all requests in this queue will be sent.
                this._queue.push( {
                    params: params,
                    proxy: proxy
                } );
                return this;
            };
        } )( method, profile[ method ] );
        // this._addMethod( method, profile[ method ] );
    }
}

ModelProxy.prototype = {
    done: function( f, ef ) {
        if ( typeof f !== 'function' ) return;

        // No request pushed in _queue, so callback directly and return.
        if ( !this._queue ) {
            f.apply( this );
            return;
        }
        // Send requests parallel
        this._sendRequestsParallel( this._queue, f, ef );

        // Clear queue
        this._queue = null;
        return this;
    },
    withCookie: function( cookie ) {
        this._cookies = cookie;
        return this;
    },
    _sendRequestsParallel: function( queue, callback, errCallback ) {
        // The final data array
        var args = [], setcookies = [], self = this;

        // Count the number of callback;
        var cnt = queue.length;

        // Send each request
        for ( var i = 0; i < queue.length; i++ ) {
            ( function( reqObj, k, cookie ) {

                reqObj.proxy.request( reqObj.params, function( data, setcookie ) {
                    // fill data for callback
                    args[ k ] = data;

                    // concat setcookie for cookie rewriting

                    //BUG fixed by Chion82 <sdspeedonion@gmail.com>
                    //undefined cookie is passed to the callback
                    if (setcookie)
                        setcookies = setcookies.concat( setcookie );
                    
                    args.push( setcookies );

                    // push the set-cookies as the last parameter for the callback function. 
                    --cnt || callback.apply( self, args.push( setcookies ) && args );

                }, function( err ) {
                    errCallback = errCallback || self._errCallback;
                    if ( typeof errCallback === 'function' ) {
                        errCallback( err );

                    } else {
                        console.error( 'Error occured when sending request ='
                            , reqObj.params, '\nCaused by:\n', err );
                    }
                }, cookie ); // request with cookie.

            } )( queue[i], i, self._cookies );
        }
        // clear cookie of this request.
        self._cookies = undefined;
    },
    error: function( f ) {
        this._errCallback = f;
    }
};

/**
 * ModelProxy.init
 * @param {String} path The path refers to the interface configuration file.
 */
ModelProxy.init = function( path ) {
    ProxyFactory.use( new InterfaceManager( path ) );
};


ModelProxy.create = function( profile ) {
    return new this( profile );
};

ModelProxy.Interceptor = function( req, res ) {
    // todo: need to handle the case that the request url is multiple 
    // interfaces combined which configured in interface.json.
    ProxyFactory.Interceptor( req, res );
};

module.exports = ModelProxy;
