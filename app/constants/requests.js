import config from './config';

export const _login = async (username, password) => {
    let loginRequestResponse;
    await fetch(config.rootUrl + 'login', {
        method: 'POST',
        headers: {
            appid: config.appId,
            Accept: 'application/json',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            username,
            password,
        })
    }).then((res) =>
        loginRequestResponse = res.json()
    )
    return loginRequestResponse;
}

export const _signup = async (username, password, confirm) => {
    let loginRequestResponse;
    await fetch(config.rootUrl + 'signup', {
        method: 'POST',
        headers: {
            appid: config.appId,
            Accept: 'application/json',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            username,
            password,
            confirm
        })
    }).then((res) =>
        loginRequestResponse = res.json()
    )
    return loginRequestResponse;
}