require 'logger' 
require 'rubygems'
require 'rack'
require 'demo/demo' 
require 'pp'

use Rack::Reloader


map "/" do 
  run Demo.new
end

