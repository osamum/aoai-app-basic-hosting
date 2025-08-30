
/*
//API Key もしくはマネージド ID を使用する場合
const rag = require('./AOAI/rag.js');
const lm = require('./AOAI/lm.js');
const webSearch = require('./AOAI/webSearch.js')
*/
//Azure KeyVault を使用する場合
let rag, lm, webSearch;
const keyManager = require('./keymgr.js');
(async () => {
    await keyManager.setSecretEnv();
    rag = require('./AOAI/rag.js');
    lm = require('./AOAI/lm.js');
    webSearch = require('./AOAI/webSearch.js')
})();

const express = require('express');

const app = express();
const port = process.env.PORT || 3000;

//'public' ディレクトリ以下を HTTP でホスト
app.use(express.static('public'));
// JSON ボディを解析するためのミドルウェア
app.use(express.json());

//クライアント情報を出力 (Web Server としてのログ)
// 解析ツールでの利用を想定して構造化して出力
app.use((req, res, next) => {
    const start = Date.now();
    res.on('finish', () => {
        const duration = Date.now() - start;
        const log = {
            timestamp: new Date().toISOString(),
            ip: req.headers['x-forwarded-for'] || req.socket.remoteAddress,
            method: req.method,
            url: req.originalUrl,
            protocol: req.protocol,
            status: res.statusCode,
            responseTimeMs: duration,
            userAgent: req.headers['user-agent'],
            referer: req.headers['referer'] || '-',
            contentLength: res.getHeader('Content-Length') || 0
        };
        console.log(JSON.stringify(log));
    });

    next();
});

// postMessage API
app.post('/postMessage', async (req, res) => {
    const { message } = req.body;

    if (!message) {
        return res.status(400).json({ error: 'Message is required' });
    }

    try {
        const responseMessage = await chat(message);
        res.json({ message: responseMessage });
    }
    catch (error) {
        //console.error('Error:', error);
        res.json({ message: error.message });
    }
});

// 演習用に意図的にエラーを発生させる
app.get('/error', (req, res, next) => {
    next(new Error('演習用の内部エラー'));
});

// エラーハンドリングミドルウェア
app.use((err, req, res, next) => {
    console.error(err.stack); // ログ出力
    res.status(500).send('Something broke! (HTTP 500)');
});


// サーバーの起動
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});


let imageUrls;

async function chat(inputString) {
    if (inputString === 'COMMAND_RESET_CONVERSATION') {
        lm.resetConversation();
        return;
    } else {
        imageUrls = getImageUrls(inputString);
        if (rag.isAvailable) {
            const findResult = await rag.findIndex(inputString);
            if (inputString === findResult) {
                return await if_Idontknow(inputString, await lm.sendMessage(inputString, imageUrls));
            } else {
                return await lm.sendMessage(findResult, imageUrls)
            }
        } else if (webSearch.isAvailable) {
            return await if_Idontknow(inputString, await lm.sendMessage(inputString, imageUrls));
        } else {
            return await lm.sendMessage(inputString, getImageUrls(inputString));
        }
        imageUrls = null;
    }
}

//文字列中の画像の URL を配列として取得する関数
function getImageUrls(content) {
    const regex = /(https?:\/\/[^\s]+?\.(?:jpg|jpeg|png|gif))/g;
    return content.match(regex) || [];
}

//言語モデルの回答の先頭が "$_SEARCHSTRING:" だった場合に検索用の文字列を取り出して、Web 検索を行う
async function if_Idontknow(inputString, assistantAnswer) {
    if (assistantAnswer.indexOf('$_SEARCHSTRING:') === 0) {
        const I_DONT_KNOW_length = 15;
        //console.log('\nAI : インターネットを検索しています...');
        const queryString = assistantAnswer.substr(I_DONT_KNOW_length);
        const re_request = await webSearch.createRequestWithWebSearchResult(inputString, queryString);
        return await lm.sendMessage(re_request, imageUrls);
    } else {
        return assistantAnswer;
    }
}
