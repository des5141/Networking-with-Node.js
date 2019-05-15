///gmsio_status()
{
    if (instance_exists(__cobj_gmsio__)) {
        return __cobj_gmsio__.status;
    }
    else {
        return gmsio_status_disconnected;
    }
}
