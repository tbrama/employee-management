export interface ListEmp {
  ls_employee: LsEmployee[];
  lsdept: Options[];
  lsstatus: Options[];
  lsjnskelamin: Options[];
}

export interface LsEmployee {
  nip: string;
  nmlengkap: string;
  tgllahir: string;
  tmplahir: string;
  jnskelamin: string;
  alamat: string;
  telepon: string;
  tglbekerja: string;
  tglakhirkontrak: string | null;
  namastatus: string;
  namadept: string;
  namajabatan: string;
  email: string;
  agama: string;
  statusmenikah: string;
  addby?: string;
  addat: string;
  lastupdateby?: string;
  updateat: string;
}

export interface Options {
  text: string;
  valOpt: string;
}
