class Demo

  def call(env)
    # pp env
    # return index.html when pointing to root
    if env['REQUEST_PATH'] == '/'
      [200, {"Content-Type" => "text/html"}, [File.read(File.join(File.dirname(__FILE__), 'index.html'))]]
    else
      # try to find the file in the demo path
      file_path = File.join(File.dirname(__FILE__), env['REQUEST_PATH'])
      unless File.exists?(file_path)
        # try to find the file in upper path (maybe we are asking for js)
        file_path = File.join(File.dirname(__FILE__), '..', env['REQUEST_PATH'])
      end
      if File.exists?(file_path)
        [200, {"Content-Type" => "text/html"}, [ File.read(file_path) ]]
      else
        [404]
      end
    end
  end

end