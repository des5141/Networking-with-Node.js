///gmsio_disconnect()
{
    //Non-HTML5
    if (os_browser == browser_not_a_browser) {
        network_destroy(__cobj_gmsio__.client);
    }
    
    //HTML5
    else {
        __gmsio_html5_disconnect__();
    }
    
    //Kill the controller
    with (__cobj_gmsio__) {
        instance_destroy();
    }
}
