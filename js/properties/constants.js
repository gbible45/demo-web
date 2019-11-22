'use strict';

angular.module('app')
    .constant('CONSTANTS', {
        languages : {
            "ko" : [
                { key : "ko", name : "한국어" }
                , { key : "en", name : "English" }
            ],
            "en" : [
                { key : "ko", name : "한국어" }
                , { key : "en", name : "English" }
            ]
        },
        apiContextUrl : '/api',
        coreApiContextUrl : '/api/core',
        commApiContextUrl : '/api/comm',
        portalApiContextUrl : '/api/portal',
        maasApiContextUrl : '/api/maas',
        baremetalApiContextUrl : '/api/portal/baremetal',
        openstackApiContextUrl : '/api/portal/openstack',
        stompConnectPath : '/stomp',
        layoutTemplateUrl : {
            accessLayout : _LAYOUT_VIEWS_ + '/frameMainBody.html',
            noAccessLayout : _LAYOUT_VIEWS_ + '/noFrameMainBody.html',
            navigation : _LAYOUT_VIEWS_ + '/navigation.html',
            leftMenu : _LAYOUT_VIEWS_ + '/commLeftMenu.html',
            mainTop : _LAYOUT_VIEWS_ + '/mainTop.html',
        },
        mainBody: {
            templateUrl: _LAYOUT_VIEWS_ + '/defaultLayoutFrame.html',
            controller: 'mainBodyCtrl',
            controllerAs: 'mainBody'
        },
        popCommFormUrl: _VIEWS_ + '/common/popCommForm.html',
        rightPopCommFormUrl: _VIEWS_ + '/common/rightPopCommForm.html',
        popAlertFormUrl: _VIEWS_ + '/common/popAlertForm.html',
        popAlertInfoFormUrl: _VIEWS_ + '/common/popAlertInfoForm.html',
        loginUrl: '/#/login',
        loginPath: '/login',
        loginState: 'login',
        homeUrl: '/#/',
        homePath: '/',
        homeState: 'dashboard',
        notLoginAcceptPages: [
            "/login",
            "/signup",
            "/sample"
        ],
        loginNoAcceptPages: [
            "/login"
        ],
        loadingProgressBar: {
            top : 80,
            down : 30
        },
        userPasswordTail : "!234",
        paging : {
            defultOrgLimit : 10,
            pageSize : 10
        },
        roleNames : {
            admin: 'ADMIN',
            developer: 'DEVELOPER',
            auditor: 'AUDITOR',
            monitor: 'MONITOR'
        },
        refreshInterval: 10000,
        refreshShoutInterval: 5000,
        monitDiffMinute: 10,// 10분
        dataTimePickerLanguages : {
            ko : {
                title: 'korean',
                monthsNames: ['1월', '2월', '3월', '4월', '5월', '6월', '7월', '8월', '9월', '10월', '11월', '12월'],
                daysNames: ['일', '월', '화', '수', '목', '금', '토'],
                todayBtn: "오늘"
            },
            en : {
                title: 'English',
                monthsNames: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
                daysNames: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
                todayBtn: 'Today'
            }
        },
        defaultMinType : "application/octet-binary",
        minTypes : {
            "pdf" : "application/pdf",
            "txt" : "text/plain",
            "html" : "text/html",
            "exe" : "application/octet-stream",
            "zip" : "application/zip",
            "doc" : "application/msword",
            "xls" : "application/vnd.ms-excel",
            "ppt" : "application/vnd.ms-powerpoint",
            "gif" : "image/gif",
            "png" : "image/png",
            "jpeg" : "image/jpg",
            "jpg" : "image/jpg",
            "php" : "text/plain"
        },
        phoneNumbers: [      //전화 지역번호
            { no: "02" },
            { no: "031" },
            { no: "032" },
            { no: "033" },
            { no: "041" },
            { no: "042" },
            { no: "043" },
            { no: "051" },
            { no: "052" },
            { no: "053" },
            { no: "054" },
            { no: "055" },
            { no: "061" },
            { no: "062" },
            { no: "063" },
            { no: "064" },
            { no: "0303" },
            { no: "0502" },
            { no: "0503" },
            { no: "0504" },
            { no: "0505" },
            { no: "0506" },
            { no: "070" },
            { no: "080" }
        ]
    })
;
