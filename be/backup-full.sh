#!/bin/bash
/opt/mssql-tools18/bin/sqlcmd -S sqlserver -U sa -P "Dang@12345" -C -Q "BACKUP DATABASE [Nexthr] TO DISK = N'/backup/Full/Nexthr_Full_$(date +%Y%m%d_%H%M%S).bak' WITH INIT, CHECKSUM"
