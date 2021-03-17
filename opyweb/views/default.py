from pyramid.view import view_config
from wakeonlan import send_magic_packet

@view_config(route_name='home', renderer='../templates/settings.jinja2')
def home_view(request):
    return {'project': 'Opyweb'}

@view_config(route_name='results', renderer='../templates/results.jinja2')
def result_view(request):
    return {'project': 'Opyweb'}

@view_config(route_name='wol', renderer='json')
def wol_view(request):
    send_magic_packet('30.9C.23.A7.8E.67', ip_address='192.168.1.255', port=9)
    return {'res': 'sent'}