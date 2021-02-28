from pyramid.view import view_config

@view_config(route_name='home', renderer='../templates/settings.jinja2')
def my_view(request):
    return {'project': 'Opyweb'}

@view_config(route_name='results', renderer='../templates/results.jinja2')
def result_view(request):
    return {'project': 'Opyweb'}
