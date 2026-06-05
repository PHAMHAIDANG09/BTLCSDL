const sql = require('mssql');

const config = {
  user: 'sa',
  password: 'Dang@12345',
  server: '127.0.0.1',
  port: 1435,
  database: 'NextHR',
  options: {
    encrypt: false,
    trustServerCertificate: true,
  }
};

async function run() {
  try {
    await sql.connect(config);
    console.log('Connected to MSSQL Database NextHR');

    console.log('\n--- 1. Employee list with Roles and Positions ---');
    const resultEmp = await sql.query`
      SELECT nv.Id, nv.MaNhanVien, nv.HoTen, vt.TenVaiTro, cv.TenChucVu, nv.NgayVaoLam, nv.TrangThai
      FROM dbo.NhanVien nv
      LEFT JOIN dbo.VaiTro vt ON vt.Id = nv.MaVaiTroId
      LEFT JOIN dbo.ChucVu cv ON cv.Id = nv.MaChucVuId
    `;
    console.table(resultEmp.recordset);

    console.log('\n--- 2. Contracts for all employees ---');
    const resultHD = await sql.query`
      SELECT hd.Id, hd.MaNhanVienId, nv.HoTen, hd.MaHopDong, hd.LuongCoBan, hd.TrangThai
      FROM dbo.HopDong hd
      INNER JOIN dbo.NhanVien nv ON nv.Id = hd.MaNhanVienId
    `;
    console.table(resultHD.recordset);

    console.log('\n--- 3. Salary History for all employees ---');
    const resultLSL = await sql.query`
      SELECT lsl.Id, lsl.MaNhanVienId, nv.HoTen, lsl.LuongCoBan, lsl.DangHieuLuc
      FROM dbo.LichSuLuong lsl
      INNER JOIN dbo.NhanVien nv ON nv.Id = lsl.MaNhanVienId
    `;
    console.table(resultLSL.recordset);

    console.log('\n--- 4. Pay slips Count by employee ---');
    const resultPL = await sql.query`
      SELECT nv.Id, nv.HoTen, COUNT(pl.Id) AS PaySlipsCount
      FROM dbo.NhanVien nv
      LEFT JOIN dbo.PhieuLuong pl ON pl.MaNhanVienId = nv.Id
      GROUP BY nv.Id, nv.HoTen
    `;
    console.table(resultPL.recordset);

  } catch (err) {
    console.error('Error:', err);
  } finally {
    await sql.close();
  }
}

run();
