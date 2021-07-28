export interface Pyniedb {
	connect (dbName: string, options: ConnectOptions): void;
}

export interface ConnectOptions{
	path: string;
}
