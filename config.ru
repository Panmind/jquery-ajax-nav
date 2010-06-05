require 'logger' 
require 'rubygems'
require 'rack'
require 'demo/demo' 

use Rack::Reloader

map "/" do 
  run Demo.new
end

