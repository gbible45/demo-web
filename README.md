# Demo Web
## Description ##
Demo Web Service is made by NGINX and AngulaJS 1.5

## Setting ##
1. Nginx Web Server Install
- 설치
```bash
vi /etc/yum.repos.d/nginx.repo
[nginx]
name=Nginx Repository
baseurl=http://nginx.org/packages/centos/7/$basearch/
gpgchecl=0
enabled=1

yum install -y nginx
```
- 방화벽 열기 (firewall 방화벽이 있는 경우에만)
```bash
firewall-cmd --permanent --zone=public --add-port=80/tcp
firewall-cmd --reload

firewall-cmd --list-ports
```

2. Git clone
- demo-web git clone
```bash
cd /usr/share/nginx/html
git clone http://211.253.135.7:8080/demo/demo-web.git
```

3. Nginx 설정 (Portal)
```
vi /etc/nginx/conf.d/default.conf
    server {
        listen 80 default_server;
        listen [::]:80 default_server;

        root /usr/share/nginx/html/demo-web;
        index index.html;

        server_name _;
        
        ## IE 호환서 보기 설정
        add_header "X-UA-Compatible" "IE=Edge,chrome=1";
        
        client_max_body_size    20m;
        client_body_buffer_size 256k;
        
        location / {
            try_files $uri $uri/ =404;
            proxy_connect_timeout       30;
            proxy_send_timeout          30;
            proxy_read_timeout          30;
            send_timeout                30;
            proxy_buffers              4 32k;
            proxy_temp_file_write_size  64k;
        }

        ## api
        location ^~ /api/ {
            ## api 서버 host:port
            proxy_pass http://172.27.0.3:8088;
        }
        
        ## api ping
        location ^~ /api/core/ping/ {
            ## api 서버 host:port
            proxy_connect_timeout       5;
            proxy_send_timeout          5;
            proxy_read_timeout          5;
            send_timeout                5;
            proxy_pass http://172.27.0.3:8088;
        }
    }

systemctl restart nginx
```


3. Nginx 설정 - api 없이 local
```
vi /etc/nginx/conf.d/default.conf
    server {
        listen 80 default_server;
        listen [::]:80 default_server;

        root /usr/share/nginx/html/demo-web;
        index index.html;

        server_name _;
        
        ## IE 호환서 보기 설정
        add_header "X-UA-Compatible" "IE=Edge,chrome=1";
        
        client_max_body_size    20m;
        client_body_buffer_size 256k;
        
        location / {
            try_files $uri $uri/ =404;
            proxy_connect_timeout       30;
            proxy_send_timeout          30;
            proxy_read_timeout          30;
            send_timeout                30;
            proxy_buffers              4 32k;
            proxy_temp_file_write_size  64k;
        }

        ## api
        location ^~ /api/ {
            ## api 서버 host:port
            proxy_pass http://211.253.135.7;
        }
        
        ## api ping
        location ^~ /api/core/ping/ {
            ## api 서버 host:port
            proxy_connect_timeout       5;
            proxy_send_timeout          5;
            proxy_read_timeout          5;
            send_timeout                5;
            proxy_pass http://211.253.135.7;
        }
    }

systemctl restart nginx
```

5. Nginx 실행/정지/재실행
```bash
sudo service nginx start

sudo service nginx stop

sudo service nginx restart
```

## Folder structure:
 ```
demo-web
├─ css - css file dir
│  ├─ components - components css file dir
│  └─ customs - custom components css file dir
├─ fonts - font file dir
├─ images - image file dir
├─ js - js files
│  ├─ components - components file dir
│  │  ├─ modules - components module file dir
│  │  └─ provider - components provider config setting file dir
│  ├─ controllers - controller file dir
│  │  ├─ dashboard - dashboard stage dir
│  │  ├─ member - member stage dir
│  │  ├─ sample - sample stage dir
│  │  ├─ user - user stage dir
│  │  ├─ commonControllers.js - common setting controller file
│  │  └─ portalControllers.js - portal page controller file
│  ├─ directives - directive file dir
│  │  └─ commonDirectives.js - common directive file
│  ├─ filters - directive file dir
│  │  └─ commonFilters.js - common filters file
│  ├─ locales - language file dir
│  │  ├─ validation - validation language file dir
│  │  │  ├─ en.json - en language file
│  │  │  └─ kr.json - kr language file
│  │  ├─ local-en.json - en language file
│  │  └─ local-kr.json - kr language file
│  ├─ properties - directive file dir
│  │  ├─ constants.js - constants file : CONSTANTS
│  │  ├─ loadFiles.js - loadModel definition file
│  │  └─ sitemap.js - sitemap file
│  ├─ services - service file dir
│  │  ├─ commonService.js - common file : common
│  │  ├─ memberService.js - member : memberService
│  │  ├─ portalService.js - portal : portalService
│  │  └─ userService.js - user : userService
├─ views - html template
│  ├─ common - common html dir
│  ├─ dashboard - dashboard stage html dir
│  ├─ layout - layout html dir
│  ├─ member - member stage html dir
│  ├─ sample - sample html dir
│  └─ user - user stage html dir 
└─ index.html - index html file
 ```

## 개발 참조
- [AngularJs 기본개념](http://w3devlabs.net/wp/?p=15)
- [AngularJs 해보기](http://soomong.net/blog/2014/01/20/translation-ultimate-guide-to-learning-angularjs-in-one-day/)
- [MAAS Api 문서](https://docs.maas.io/2.3/en/api)

