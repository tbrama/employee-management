export interface Login {
  data: DataLogin;
  msg: string;
  token: string;
}

export interface DataLogin {
  nip: string;
  nmlengkap: string;
  tgllahir: string;
  tmplahir: string;
  jnskelamin: string;
  alamat: string;
  telepon: string;
  tglbekerja: string;
  tglakhirkontrak: any;
  status: string;
  dept: string;
  jabatan: string;
  email: string;
  agama: string;
  statusmenikah: string;
  addby: string;
  addat: string;
  lastupdateby: string;
  updateat: string;
  nip2: string;
}
