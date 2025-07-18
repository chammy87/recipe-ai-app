import express from 'express';
import dotenv from 'dotenv';
import OpenAI from 'openai';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();

// ESモジュールで __dirname を使うための設定
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Express アプリ初期化
const app = express();
const port = 3000;

app.use(express.json());
app.use(express.static(__dirname));

// OpenAI API クライアント初期化（v4仕様）
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// index.html を返すルート
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// レシピ生成エンドポイント
app.post('/recipe', async (req, res) => {
  const {
    ingredients,
    adultCount,
    childrenCount,
    wantKidsMenu,
    genre,
    request,
    avoid,
  } = req.body;

  const prompt = `
以下の条件に合う夕食レシピを1つ提案してください。

- 食材: ${ingredients}
- 大人の人数: ${adultCount}
- 子どもの人数: ${childrenCount}
- 子ども向けメニュー希望: ${wantKidsMenu}
- ジャンル: ${genre}
- 調理の希望: ${request}
- 避けたい食材: ${avoid}

【出力フォーマット】
料理名：
材料：
手順：
`;

  try {
    const chatCompletion = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [{ role: 'user', content: prompt }],
    });

    const result = chatCompletion.choices[0].message.content;
    res.json({ recipe: result });

  } catch (error) {
    console.error('OpenAI API Error:', error);
    res.status(500).json({ recipe: 'レシピの生成に失敗しました。' });
  }
});

// サーバー起動
app.listen(port, '0.0.0.0', () => {
  console.log(`Server is running on port ${port}`);
});
