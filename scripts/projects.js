import http from 'k6/http';
import { b64encode } from 'k6/encoding'
import { check } from 'k6';
import { exec, scenario } from 'k6/execution';
import { uuidv4 } from 'https://jslib.k6.io/k6-utils/1.4.0/index.js';

const sso_url = '';
const app_url = '';
const secrets = JSON.parse(open('./secrets.json'));

export function setup() {
    const res = http.post(sso_url, {
        client_id: secrets.client_id,
        client_secret: secrets.client_secret,
        grant_type: 'client_credentials',
    });

    if (res.status !== 200) {
        exec.test.abort(`Received '${res.status_text}' from '${res.url}'`);
    }

    return res.json().access_token;
}

export const options = {
    scenarios: {
        projects: {
            exec: 'projects',
            executor: 'constant-arrival-rate',
            rate: 1,
            timeUnit: '1s',
            duration: '30s',
            preAllocatedVUs: 25,
        },
    },
};

export function projects(authToken) {
    const res = http.get(
        `${app_url}/preferences/projects`,
        {
            headers: {
                Authorization: `Bearer ${authToken}`,
                'Content-Type': 'application/json',
            },
        }
    );
    check(
        res,
        {
            //'is status 200': (r) => r.status === 200,
            'is status 401?': (r) => r.status === 401,
        },
        { status: res.status }
    );
}
