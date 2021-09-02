import time

from pyramid.view import view_config
import ping3
from wakeonlan import send_magic_packet
import paramiko

def restartService():

    hostname = "192.168.1.36"
    username = "Val"
    password = "Manon888"
    cmd = 'net stop OpyService &  net start OpyService'
    ssh(hostname, username, password, cmd)

def shutdown():
    hostname = "192.168.1.36"
    username = "Val"
    password = "Manon888"
    cmd = 'shutdown /s'
    res = ssh(hostname, username, password, cmd)
    return res

@view_config(route_name='shutdown', renderer='json')
def shutdown_view(request):
    response = shutdown()
    return response

def ssh(hostname, username, password, cmd):
    try:
        ssh = paramiko.SSHClient()
        ssh.set_missing_host_key_policy(paramiko.AutoAddPolicy())
        ssh.connect(hostname,username=username,password=password)
        print(f"Connected to {hostname} as {username}")
        #transport = ssh.get_transport()
        #channel = transport.open_session()
        #channel.exec_command(cmd2)
        stdin, stdout, stderr = ssh.exec_command(cmd)
        err = ''.join(stderr.readlines())
        out = ''.join(stdout.readlines())
        print (f"err={err}, out={out}")
        return {"out":str(out), "err":str(err)}
    except paramiko.AuthenticationException:
        err = ("Failed to connect to %s due to wrong username/password" %hostname)
        return {"out":1, "err":err}
    except Exception as e:
        err = e.message
        return {"out":2, "err":err}




@view_config(route_name='restartservice', renderer='json')
def restart_service_view(request):
    print ("try to restart service")
    final_output = restartService()
    res = False
    if "started successfully" in final_output["out"]:
        res = True
        print ("service restarted")
    return {'res': res, "final_output" : final_output}


@view_config(route_name='ping', renderer='json')
def ping_view(request):
    print ("ping")
    res = True
    response = ping3.ping('192.168.1.36',  timeout=1)
    if response == None:
        res = False
    return {'res': res}


@view_config(route_name='wait_server_up', renderer='json')
def wait_server_up_view(request):
    send_magic_packet('30.9C.23.A7.8E.67', ip_address='192.168.0.215', port=9)
    s = time.time()
    e = time.time()
    while e - s < 120:
        response = ping3.ping('192.168.1.36', timeout=1)
        if response == None:
            print (".")
            time.sleep(2)
            e = time.time()
        else :
            return {'res': True}
    return {'res': False}


@view_config(route_name='wol', renderer='json')
def wol_view(request):
    response = ping3.ping('192.168.1.36', timeout=1)
    if response == None:
        send_magic_packet('30.9C.23.A7.8E.67', ip_address='192.168.0.215', port=9)
        return {'res': 'sent'}
    return {'res': 'up'}
