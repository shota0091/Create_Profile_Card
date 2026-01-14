document.addEventListener('DOMContentLoaded', () => {
    const canvas = document.getElementById('profileCanvas');
    const ctx = canvas.getContext('2d');
    const modal = document.getElementById('previewModal');
    
    // 画像の読み込み設定
    const templateImg = new Image();
    // セキュリティエラー回避のため（ローカル環境でもサーバー経由なら有効）
    templateImg.crossOrigin = "Anonymous";
    // ★画像ファイル名が正しいか必ず確認してください
    templateImg.src = '../static/template.jpeg'; 

    // 都道府県データ
    const PREF_DATA = {
        hokkaido_tohoku: ["北海道", "青森", "岩手", "宮城", "秋田", "山形", "福島"],
        kanto: ["東京", "神奈川", "千葉", "埼玉", "茨城", "栃木", "群馬"],
        chubu: ["愛知", "静岡", "岐阜", "三重", "山梨", "長野", "新潟", "富山", "石川", "福井"],
        kinki: ["大阪", "京都", "兵庫", "奈良", "滋賀", "和歌山"],
        chugoku: ["広島", "岡山", "山口", "鳥取", "島根"],
        shikoku: ["香川", "愛媛", "徳島", "高知"],
        kyushu_okinawa: ["福岡", "佐賀", "長崎", "熊本", "大分", "宮崎", "鹿児島", "沖縄"]
    };

    // 初期化処理（セレクトボックスの生成など）
    const initSelects = () => {
        // 年齢
        const ageSel = document.getElementById('ageSelect');
        for (let i = 18; i <= 80; i++) ageSel.add(new Option(`${i}歳`, i));

        // 日付連動
        const mSel = document.getElementById('birthMonth');
        const dSel = document.getElementById('birthDay');
        for (let i = 1; i <= 12; i++) mSel.add(new Option(`${i}月`, i));

        mSel.addEventListener('change', () => {
            dSel.innerHTML = '<option value="">日</option>';
            if (!mSel.value) { dSel.disabled = true; return; }
            dSel.disabled = false;
            const days = new Date(2024, mSel.value, 0).getDate();
            for (let i = 1; i <= days; i++) dSel.add(new Option(`${i}日`, i));
        });
    };

    // 地域連動（地方を選ぶと都道府県が出る）
    document.getElementById('areaSelect').addEventListener('change', (e) => {
        const prefSel = document.getElementById('prefSelect');
        const prefs = PREF_DATA[e.target.value] || [];
        prefSel.innerHTML = '<option value="">都道府県を選択</option>';
        prefs.forEach(p => prefSel.add(new Option(p, p)));
        prefSel.disabled = !prefs.length;
    });

    // タグ取得（スペース区切りで配列化）
    const getTags = (id) => {
        const val = document.getElementById(id).value;
        return val.trim().split(/[\s　]+/).filter(Boolean).slice(0, 5);
    };

    // ★★★ Canvas描画処理（ここがメイン） ★★★
    const drawCard = () => {
        // キャンバスをクリア
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        // 背景画像を描画
        ctx.drawImage(templateImg, 0, 0, 614, 868);

        // --------------------------------------------------
        // 1. お名前（性別で色分け）
        // --------------------------------------------------
        const gender = document.getElementById('genderSelect').value;

        // 色の分岐
        if (gender === '男性') {
            ctx.fillStyle = "#007AFF"; // 青
        } else if (gender === '女性') {
            ctx.fillStyle = "#FF4081"; // 赤（ピンク）
        } else {
            ctx.fillStyle = "#6b4a3a"; // ブラウン（デフォルト）
        }

        ctx.font = "bold 22px 'Helvetica Neue', Arial, sans-serif";
        const name = document.getElementById('userName').value || "未入力";
        ctx.fillText(name, 130, 196); 


        // --------------------------------------------------
        // 2. 基本情報（色をブラウンに戻して描画）
        // --------------------------------------------------
        ctx.fillStyle = "#6b4a3a"; // ★必ず戻す
        ctx.font = "bold 16px 'Helvetica Neue', Arial, sans-serif";
        
        // 地域
        const region = document.getElementById('prefSelect').value || "未入力";
        ctx.fillText(region, 120, 262);

        // 年齢
        const age = document.getElementById('ageSelect').value ? `${document.getElementById('ageSelect').value}歳` : "未入力";
        ctx.fillText(age, 410, 262);

        // 誕生日
        const m = document.getElementById('birthMonth').value;
        const d = document.getElementById('birthDay').value;
        const birth = (m && d) ? `${m}月${d}日` : "未入力";
        ctx.fillText(birth, 120, 322);

        // 職業
        const job = document.getElementById('jobInput').value || "未入力";
        ctx.fillText(job, 410, 322);


        // --------------------------------------------------
        // 3. 3カラム（趣味・特技・タイプ）中央揃え
        // --------------------------------------------------
        ctx.textAlign = "center"; // ★文字の基準を中心に

        // リスト描画用関数
        const drawList = (tags, xBase, yStart) => {
            let y = yStart;
            tags.forEach(tag => {
                ctx.fillText(tag, xBase, y);
                y += 28; // 行間
            });
        };

        // 各ボックスの中心座標を指定して描画
        drawList(getTags('hobbyInput'), 115, 462); // 趣味
        drawList(getTags('skillInput'), 312, 462); // 特技
        drawList(getTags('likeInput'), 508, 462); // タイプ


        // --------------------------------------------------
        // 4. ひとこと（改行・自動折り返し対応）
        // --------------------------------------------------
        ctx.textAlign = "left"; // ★左揃えに戻す
        ctx.font = "18px 'Helvetica Neue', Arial, sans-serif";
        
        const msg = document.getElementById('messageInput').value || "よろしくお願いします！";
        
        // 横幅あふれ計算用関数
        const splitTextByWidth = (text, maxWidth) => {
            let lines = [];
            let line = '';
            for (let i = 0; i < text.length; i++) {
                if (ctx.measureText(line + text[i]).width > maxWidth) {
                    lines.push(line);
                    line = text[i];
                } else {
                    line += text[i];
                }
            }
            lines.push(line);
            return lines;
        };

        // まず「改行コード」で分割し、その後「横幅」で分割する
        const rawLines = msg.split('\n');
        let finalLines = [];

        rawLines.forEach(rawLine => {
            const wrapped = splitTextByWidth(rawLine, 520); // 520pxで折り返し
            finalLines = finalLines.concat(wrapped);
        });
        
        // 描画実行
        let lineY = 710;
        finalLines.forEach(l => {
            ctx.fillText(l, 46, lineY);
            lineY += 26;
        });
    };

    // ★★★ イベント設定 ★★★
    const openModal = () => {
        drawCard(); // 画像生成を実行
        modal.showModal();
        // モーダルを開いた瞬間にスクロール位置を上に戻す
        const body = document.querySelector('.modal-body');
        if(body) body.scrollTop = 0;
    };
    
    const closeModal = () => modal.close();

    // ボタンアクション
    const btnPreview = document.getElementById('btnToPreview');
    if(btnPreview) btnPreview.addEventListener('click', openModal);

    const btnClose = document.getElementById('btnClosePreview');
    if(btnClose) btnClose.addEventListener('click', closeModal);
    
    const btnBack = document.getElementById('btnBack');
    if(btnBack) btnBack.addEventListener('click', closeModal);

    // 画像保存（ダウンロード）
    const btnCreate = document.getElementById('btnCreate');
    if(btnCreate) {
        btnCreate.addEventListener('click', () => {
            const link = document.createElement('a');
            link.download = `profile_${Date.now()}.png`;
            try {
                link.href = canvas.toDataURL('image/png');
                link.click();
                closeModal();
            } catch (e) {
                console.error("画像保存エラー: ローカルファイルとして開いている可能性があります。", e);
                alert("画像の保存に失敗しました。VS CodeのLive Server機能などを使ってプレビューしてください。");
            }
        });
    }

    // 初期化実行
    initSelects();
    
    // 念のため画像読み込み完了ログ
    templateImg.onload = () => {
        console.log("Template Loaded Successfully");
    };
});