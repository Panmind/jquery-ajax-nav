require 'pathname'
require 'rack/mime'
require 'rack/request'

class Demo

  def call(env)
    req = Rack::Request.new(env)

    case req.path
    when '/'
      # If the request comes via XHR, don't return the whole index.html page
      #
      name = req.xhr? ? 'index-xhr.html' : 'index.html'
      [200, {'Content-Type' => 'text/html'}, [ asset(name).read ]]

    when '/form'
      # Return a 202 on this path, to demonstrate AJAX redirects: the body
      # of the request must contain the path where the client side JS will
      # redirect to.
      #
      [202, {'Content-Type' => 'text/plain'}, [ '/form_response.html' ]]

    else
      # Try to find the file in the demo path and serve it
      #
      asset = asset(req.path)

      if asset
        [200, {'Content-Type' => Rack::Mime.mime_type(asset.extname)}, [ asset.read ]]
      else
        [404, {'Content-Type' => 'text/plain'}, [ 'not found' ]]
      end
    end
  end

  private
    Root = Pathname('.').realpath

    # Returns a pathname for the given asset name by removing an
    # eventual leading / and joining it to the demo Root. If the
    # result is not a file or is not readable, \nil is returned.
    #
    def asset(name)
      path = Root.join name.to_s.sub(/^\//, '')
      path.file? && path.readable? ? path : nil
    end

end
