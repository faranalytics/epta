import * as http from 'node:http';
import * as util from 'node:util';

import { HTTPServer } from 'epta';

let httpServer = new HTTPServer({ port: 3000, host: 'localhost' });
