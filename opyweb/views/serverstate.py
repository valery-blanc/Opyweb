from pyramid.view import view_config

import paramiko

def startService():
    hostname = "192.168.1.36"
    username = "Val"
    password = "Manon888"
    cmd = 'net stop OpyService &  net start OpyService'
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
        print("Failed to connect to %s due to wrong username/password" %hostname)
        exit(1)
    except Exception as e:
        print(e.message)
        exit(2)




@view_config(route_name='serverstate', renderer='json')
def serverstate_view(request):
    print ("try to restart service")
    final_output = startService()
    res = False
    if "started successfully" in final_output["out"]:
        res = True
        print ("service restarted")
    return {'res': res, "final_output" : final_output}


