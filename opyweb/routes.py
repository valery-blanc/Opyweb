def includeme(config):
    config.add_static_view('static', 'static', cache_max_age=3600)
    config.add_route('home', '/')
    config.add_route('settings', '/settings')
    config.add_route('results', '/results')
    config.add_route('wol', '/wol')
    config.add_route('restartservice', '/restartservice')
    config.add_route('wait_server_up', '/wait_server_up')
    config.add_route('ping', '/ping')
    config.add_route('shutdown', '/shutdown')
