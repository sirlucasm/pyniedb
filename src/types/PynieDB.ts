export interface IPynieDB {
	connect (dbName: string, options: IConnectOptions): void;
}

export interface IConnectOptions{
	path: string;
}
