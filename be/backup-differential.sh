#!/bin/bash
/opt/mssql-tools18/bin/sqlcmd -S sqlserver -U sa -P "Dang@12345" -C -Q "BACKUP DATABASE [Nexthr] TO DISK = N'/backup/Differential/Nexthr_Diff_$(date +%Y%m%d_%H%M%S).bak' WITH DIFFERENTIAL, INIT, CHECKSUM"
