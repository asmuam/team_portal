CREATE VIEW TimkerjaProgress AS
SELECT 
    t.id AS timkerja_id,
    t.name AS timkerja_name,
    COUNT(CASE WHEN tk.completed = TRUE THEN 1 END) / COUNT(tk.id) AS progress
FROM 
    Timkerja t
JOIN 
    Kegiatan k ON k.timkerja_id = t.id
JOIN 
    Subkegiatan sk ON sk.kegiatan_id = k.id
JOIN 
    Tugas tk ON tk.subkegiatan_id = sk.id
GROUP BY 
    t.id, t.name;


CREATE VIEW KegiatanProgress AS
SELECT 
    k.id AS kegiatan_id,
    k.name AS kegiatan_name,
    COUNT(CASE WHEN tk.completed = TRUE THEN 1 END) / COUNT(tk.id) AS progress
FROM 
    Kegiatan k
JOIN 
    Subkegiatan sk ON sk.kegiatan_id = k.id
JOIN 
    Tugas tk ON tk.subkegiatan_id = sk.id
GROUP BY 
    k.id, k.name;


CREATE VIEW SubkegiatanProgress AS
SELECT 
    sk.id AS subkegiatan_id,
    sk.name AS subkegiatan_name,
    COUNT(CASE WHEN tk.completed = TRUE THEN 1 END) / COUNT(tk.id) AS progress
FROM 
    Subkegiatan sk
JOIN 
    Tugas tk ON tk.subkegiatan_id = sk.id
GROUP BY 
    sk.id, sk.name;
