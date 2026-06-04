#!/bin/bash
/opt/mssql-tools18/bin/sqlcmd -S sqlserver -U sa -P "Dang@12345" -C -Q "BACKUP LOG [Nexthr] TO DISK = N'/backup/TransactionLog/Nexthr_Log_$(date +%Y%m%d_%H%M%S).trn' WITH INIT, CHECKSUM"
