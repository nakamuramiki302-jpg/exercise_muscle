// 筋肉の画像マッピング（無料の解剖学画像URLを使用）
const muscleImages = {
    // 上肢
    "三角筋": "https://upload.wikimedia.org/wikipedia/commons/thumb/0/0b/Deltoid_muscle_top9.png/300px-Deltoid_muscle_top9.png",
    "上腕二頭筋": "https://upload.wikimedia.org/wikipedia/commons/thumb/1/13/Biceps_brachii.png/200px-Biceps_brachii.png",
    "上腕三頭筋": "https://upload.wikimedia.org/wikipedia/commons/thumb/3/35/Triceps_brachii.png/200px-Triceps_brachii.png",
    "大胸筋": "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e3/Pectoralis_major.png/250px-Pectoralis_major.png",
    "広背筋": "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c4/Latissimus_dorsi.png/250px-Latissimus_dorsi.png",
    "僧帽筋": "https://upload.wikimedia.org/wikipedia/commons/thumb/3/3d/Trapezius_Gray409.PNG/250px-Trapezius_Gray409.PNG",
    
    // 体幹
    "腹直筋": "https://upload.wikimedia.org/wikipedia/commons/thumb/5/5d/Rectus_abdominis.png/200px-Rectus_abdominis.png",
    "腹斜筋": "https://upload.wikimedia.org/wikipedia/commons/thumb/8/8c/External_oblique.png/200px-External_oblique.png",
    
    // 下肢
    "大腿四頭筋": "https://upload.wikimedia.org/wikipedia/commons/thumb/4/4f/Quadriceps_3D.gif/250px-Quadriceps_3D.gif",
    "ハムストリングス": "https://upload.wikimedia.org/wikipedia/commons/thumb/7/72/Hamstring_muscles.png/200px-Hamstring_muscles.png",
    "大殿筋": "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e4/Gluteus_maximus.png/250px-Gluteus_maximus.png",
    "腓腹筋": "https://upload.wikimedia.org/wikipedia/commons/thumb/9/93/Gastrocnemius.png/200px-Gastrocnemius.png"
};

// スポーツ動作と筋肉のデータベース（間違えやすい選択肢に改善）
const sportsData = [
    // 陸上競技
    {
        sport: "陸上競技",
        action: "走る",
        usedMuscles: ["大腿四頭筋", "ハムストリングス", "腓腹筋"],
        unusedMuscles: ["前脛骨筋"],
        hint: "股関節伸展、膝関節伸展、足関節底屈",
        explanation: "【主要動作】股関節伸展（大殿筋・ハムストリングス）、膝関節伸展（大腿四頭筋）、足関節底屈（腓腹筋・ヒラメ筋）。推進期では大腿四頭筋が求心性収縮し、着地時にはハムストリングスが遠心性収縮で制動する。前脛骨筋は足関節背屈筋であり、推進力には直接関与しない。"
    },
    {
        sport: "陸上競技",
        action: "スタートダッシュ",
        usedMuscles: ["大腿四頭筋", "大殿筋", "腓腹筋"],
        unusedMuscles: ["前脛骨筋"],
        hint: "股関節・膝関節の爆発的伸展、足関節底屈",
        explanation: "【主要動作】股関節の爆発的伸展（大殿筋が最大収縮）、膝関節伸展（大腿四頭筋）、足関節底屈（腓腹筋）。スタート時は股関節が深く屈曲した状態から、大殿筋と大腿四頭筋が協調して強力な伸展トルクを発生させる。前脛骨筋は拮抗筋として働かない。"
    },
    {
        sport: "陸上競技",
        action: "足を上げる",
        usedMuscles: ["腸腰筋", "大腿四頭筋", "腹直筋"],
        unusedMuscles: ["ハムストリングス"],
        hint: "股関節屈曲、膝関節伸展",
        explanation: "股関節の屈曲、膝関節の伸展。脚を前方に振り出す動作。"
    },
    {
        sport: "陸上競技",
        action: "腕振り",
        usedMuscles: ["三角筋", "上腕三頭筋", "大胸筋"],
        unusedMuscles: ["上腕二頭筋"],
        hint: "肩関節屈曲・伸展、肘関節伸展",
        explanation: "肩関節の屈曲・伸展、肘関節の伸展。走行時のバランスと推進力補助。"
    },
    {
        sport: "陸上競技",
        action: "着地で衝撃吸収",
        usedMuscles: ["大腿四頭筋", "ハムストリングス", "腓腹筋"],
        unusedMuscles: ["前脛骨筋"],
        hint: "膝関節・足関節の遠心性収縮",
        explanation: "膝関節・足関節の制御された屈曲（遠心性収縮）。衝撃を吸収する。"
    },
    
    // サッカー
    {
        sport: "サッカー",
        action: "ボールを蹴る",
        usedMuscles: ["大腿四頭筋", "腸腰筋", "大殿筋"],
        unusedMuscles: ["ハムストリングス"],
        hint: "股関節屈曲→伸展、膝関節伸展",
        explanation: "股関節の屈曲→伸展、膝関節の伸展。脚を振り上げて蹴り出す動作。"
    },
    {
        sport: "サッカー",
        action: "走る",
        usedMuscles: ["大腿四頭筋", "ハムストリングス", "腓腹筋"],
        unusedMuscles: ["前脛骨筋"],
        hint: "股関節・膝関節伸展、足関節底屈",
        explanation: "股関節・膝関節の伸展、足関節の底屈。推進力を生み出す。"
    },
    {
        sport: "サッカー",
        action: "ヘディングジャンプ",
        usedMuscles: ["大腿四頭筋", "腓腹筋", "腹直筋"],
        unusedMuscles: ["ハムストリングス"],
        hint: "膝関節・足関節伸展、体幹屈曲",
        explanation: "膝関節・足関節の伸展、体幹の屈曲。垂直方向への跳躍とヘディング動作。"
    },
    {
        sport: "サッカー",
        action: "タックル動作",
        usedMuscles: ["大腿四頭筋", "大殿筋", "腹直筋"],
        unusedMuscles: ["腓腹筋"],
        explanation: "股関節・膝関節の伸展、体幹の安定。相手に向かって踏み込む動作。"
    },
    {
        sport: "サッカー",
        action: "パス・トラップ",
        usedMuscles: ["大腿四頭筋", "内転筋群", "腸腰筋"],
        unusedMuscles: ["大殿筋"],
        explanation: "股関節の内転・屈曲、膝関節の制御。ボールを足でコントロールする動作。"
    },
    
    // バスケットボール
    {
        sport: "バスケットボール",
        action: "ダッシュと急停止",
        usedMuscles: ["大腿四頭筋", "ハムストリングス", "腓腹筋"],
        unusedMuscles: ["前脛骨筋"],
        explanation: "加速時は伸展、急停止時は遠心性収縮で制動。膝・足関節の制御。"
    },
    {
        sport: "バスケットボール",
        action: "ジャンプシュート",
        usedMuscles: ["大腿四頭筋", "腓腹筋", "上腕三頭筋"],
        unusedMuscles: ["ハムストリングス"],
        explanation: "【主要動作】下肢：膝関節伸展（大腿四頭筋）、足関節底屈（腓腹筋・ヒラメ筋）による垂直跳躍。上肢：肘関節伸展（上腕三頭筋）、肩関節屈曲（三角筋前部）によるシュート動作。ジャンプは伸展動作が主体であり、ハムストリングスは股関節伸展に関与するが、膝関節では屈曲筋として働くため、垂直跳躍の主動作筋ではない。"
    },
    {
        sport: "バスケットボール",
        action: "ドリブル",
        usedMuscles: ["上腕三頭筋", "三角筋", "前腕筋群"],
        unusedMuscles: ["上腕二頭筋"],
        explanation: "肘関節の伸展、手関節の屈曲・伸展。ボールを押し出す動作。"
    },
    {
        sport: "バスケットボール",
        action: "リバウンド",
        usedMuscles: ["大腿四頭筋", "腓腹筋", "三角筋"],
        unusedMuscles: ["大胸筋"],
        explanation: "下肢の伸展でジャンプ、肩関節の外転で腕を上げる。垂直跳躍とリーチ。"
    },
    {
        sport: "バスケットボール",
        action: "パス",
        usedMuscles: ["大胸筋", "三角筋", "上腕三頭筋"],
        unusedMuscles: ["広背筋"],
        explanation: "肩関節の水平内転、肘関節の伸展。ボールを前方に押し出す動作。"
    },
    
    // バレーボール
    {
        sport: "バレーボール",
        action: "トス・アタック",
        usedMuscles: ["三角筋", "大胸筋", "上腕三頭筋"],
        unusedMuscles: ["広背筋"],
        explanation: "肩関節の屈曲・内旋、肘関節の伸展。ボールを上から叩きつける動作。"
    },
    {
        sport: "バレーボール",
        action: "ブロック",
        usedMuscles: ["三角筋", "僧帽筋", "腹直筋"],
        unusedMuscles: ["大胸筋"],
        explanation: "肩関節の外転・挙上、体幹の安定。腕を高く上げて壁を作る動作。"
    },
    {
        sport: "バレーボール",
        action: "サーブ",
        usedMuscles: ["三角筋", "上腕三頭筋", "腹直筋"],
        unusedMuscles: ["上腕二頭筋"],
        explanation: "肩関節の屈曲・内旋、肘関節の伸展、体幹の屈曲。ボールを打ち込む動作。"
    },
    {
        sport: "バレーボール",
        action: "レシーブ",
        usedMuscles: ["大腿四頭筋", "腹直筋", "三角筋"],
        unusedMuscles: ["大胸筋"],
        explanation: "膝関節の屈曲、体幹の安定、肩関節の制御。低い姿勢でボールを受ける。"
    },
    {
        sport: "バレーボール",
        action: "サイドステップ",
        usedMuscles: ["大腿四頭筋", "内転筋群", "外転筋群"],
        unusedMuscles: ["腓腹筋"],
        explanation: "股関節の外転・内転。横方向への素早い移動動作。"
    },
    
    // 野球
    {
        sport: "野球",
        action: "バットスイング",
        usedMuscles: ["腹斜筋", "大胸筋", "広背筋"],
        unusedMuscles: ["腹直筋"],
        explanation: "体幹の回旋、肩関節の水平内転。回転運動でバットを振る動作。"
    },
    {
        sport: "野球",
        action: "ピッチング（投球）",
        usedMuscles: ["三角筋", "大胸筋", "上腕三頭筋"],
        unusedMuscles: ["上腕二頭筋"],
        explanation: "【主要動作】肩関節の内旋（肩甲下筋・大胸筋）、水平内転（大胸筋・三角筋前部）、肘関節伸展（上腕三頭筋）。加速期では大胸筋と三角筋前部が強力に収縮し、上腕三頭筋が肘を伸展させる。上腕二頭筋は肘屈曲筋であり、投球動作では拮抗筋として働く。リリース後の減速期には上腕二頭筋が遠心性収縮するが、加速期の主動作筋ではない。"
    },
    {
        sport: "野球",
        action: "捕球",
        usedMuscles: ["三角筋", "上腕二頭筋", "前腕筋群"],
        unusedMuscles: ["大胸筋"],
        explanation: "肩関節の外転、肘関節の屈曲、手関節の制御。ボールをキャッチする動作。"
    },
    {
        sport: "野球",
        action: "走塁",
        usedMuscles: ["大腿四頭筋", "ハムストリングス", "腓腹筋"],
        unusedMuscles: ["前脛骨筋"],
        explanation: "股関節・膝関節の伸展、足関節の底屈。全力疾走の動作。"
    },
    {
        sport: "野球",
        action: "送球",
        usedMuscles: ["三角筋", "大胸筋", "上腕三頭筋"],
        unusedMuscles: ["広背筋"],
        explanation: "肩関節の内旋・屈曲、肘関節の伸展。素早くボールを投げる動作。"
    },
    
    // テニス
    {
        sport: "テニス",
        action: "フォア・バックハンド",
        usedMuscles: ["三角筋", "大胸筋", "腹斜筋"],
        unusedMuscles: ["腹直筋"],
        explanation: "肩関節の水平内転、体幹の回旋。ラケットを振り抜く回転動作。"
    },
    {
        sport: "テニス",
        action: "サーブ",
        usedMuscles: ["三角筋", "上腕三頭筋", "腹直筋"],
        unusedMuscles: ["上腕二頭筋"],
        explanation: "肩関節の屈曲・内旋、肘関節の伸展、体幹の屈曲。上から打ち下ろす動作。"
    },
    {
        sport: "テニス",
        action: "左右ステップ",
        usedMuscles: ["大腿四頭筋", "内転筋群", "外転筋群"],
        unusedMuscles: ["腓腹筋"],
        explanation: "股関節の外転・内転。横方向への素早い移動とポジショニング。"
    },
    {
        sport: "テニス",
        action: "ボレー",
        usedMuscles: ["三角筋", "大胸筋", "前腕筋群"],
        unusedMuscles: ["広背筋"],
        explanation: "肩関節の水平内転、手関節の制御。短いスイングでボールを押し出す動作。"
    },
    {
        sport: "テニス",
        action: "体重移動",
        usedMuscles: ["大腿四頭筋", "大殿筋", "腹斜筋"],
        unusedMuscles: ["ハムストリングス"],
        explanation: "股関節・膝関節の伸展、体幹の回旋。前方への体重移動で力を伝える。"
    },
    
    // 卓球
    {
        sport: "卓球",
        action: "スマッシュ",
        usedMuscles: ["三角筋", "上腕三頭筋", "大胸筋"],
        unusedMuscles: ["上腕二頭筋"],
        explanation: "肩関節の屈曲・内旋、肘関節の伸展。ボールを上から叩く動作。"
    },
    {
        sport: "卓球",
        action: "回転をかける",
        usedMuscles: ["前腕筋群", "三角筋", "腹斜筋"],
        unusedMuscles: ["大胸筋"],
        explanation: "前腕の回内・回外、手関節の屈曲・伸展。ラケットでボールに回転を与える。"
    },
    {
        sport: "卓球",
        action: "フットワーク",
        usedMuscles: ["大腿四頭筋", "内転筋群", "腓腹筋"],
        unusedMuscles: ["ハムストリングス"],
        explanation: "股関節の外転・内転、膝関節の伸展。素早い横移動とポジショニング。"
    },
    {
        sport: "卓球",
        action: "ドライブショット",
        usedMuscles: ["三角筋", "大胸筋", "腹斜筋"],
        unusedMuscles: ["広背筋"],
        explanation: "肩関節の水平内転、体幹の回旋。前方への回転を伴うスイング。"
    },
    {
        sport: "卓球",
        action: "レシーブ",
        usedMuscles: ["三角筋", "前腕筋群", "大腿四頭筋"],
        unusedMuscles: ["大胸筋"],
        explanation: "肩関節の制御、手関節の微調整、膝の屈曲。低い姿勢でボールを返す。"
    },
    
    // 水泳
    {
        sport: "水泳",
        action: "キック",
        usedMuscles: ["大腿四頭筋", "ハムストリングス", "大殿筋"],
        unusedMuscles: ["腓腹筋"],
        explanation: "股関節の屈曲・伸展、膝関節の伸展。脚全体を使った推進動作。"
    },
    {
        sport: "水泳",
        action: "ストローク",
        usedMuscles: ["三角筋", "広背筋", "大胸筋"],
        unusedMuscles: ["上腕二頭筋"],
        explanation: "肩関節の屈曲・伸展・内転。水をかいて推進力を生み出す動作。"
    },
    {
        sport: "水泳",
        action: "息継ぎ",
        usedMuscles: ["僧帽筋", "三角筋", "腹斜筋"],
        unusedMuscles: ["大胸筋"],
        explanation: "頸部の回旋、体幹の回旋。顔を横に向けて呼吸する動作。"
    },
    {
        sport: "水泳",
        action: "スタートダイブ",
        usedMuscles: ["大腿四頭筋", "大殿筋", "腓腹筋"],
        unusedMuscles: ["ハムストリングス"],
        explanation: "股関節・膝関節・足関節の爆発的な伸展。飛び込みの推進力を生む。"
    },
    {
        sport: "水泳",
        action: "ターンキック",
        usedMuscles: ["大腿四頭筋", "腹直筋", "大殿筋"],
        unusedMuscles: ["ハムストリングス"],
        explanation: "壁を蹴る伸展動作、体幹の屈曲。ターン時の推進力を生み出す。"
    },
    
    // 柔道
    {
        sport: "柔道",
        action: "踏み込み投げ",
        usedMuscles: ["大腿四頭筋", "大殿筋", "広背筋"],
        unusedMuscles: ["大胸筋"],
        explanation: "股関節・膝関節の伸展、肩関節の伸展・内転。相手を引き込んで投げる動作。"
    },
    {
        sport: "柔道",
        action: "組み手",
        usedMuscles: ["広背筋", "僧帽筋", "前腕筋群"],
        unusedMuscles: ["大胸筋"],
        explanation: "肩関節の伸展、肘関節の屈曲。相手の道着を掴んで引く動作。"
    },
    {
        sport: "柔道",
        action: "受け身",
        usedMuscles: ["腹直筋", "広背筋", "大殿筋"],
        unusedMuscles: ["大胸筋"],
        explanation: "体幹の屈曲、肩関節の伸展。投げられた時の衝撃を分散する動作。"
    },
    {
        sport: "柔道",
        action: "体重移動",
        usedMuscles: ["大腿四頭筋", "大殿筋", "腹斜筋"],
        unusedMuscles: ["腓腹筋"],
        explanation: "股関節・膝関節の伸展、体幹の回旋。相手を崩すための重心移動。"
    },
    {
        sport: "柔道",
        action: "引き手",
        usedMuscles: ["広背筋", "上腕二頭筋", "僧帽筋"],
        unusedMuscles: ["大胸筋"],
        explanation: "肩関節の伸展、肘関節の屈曲。相手を引き寄せる動作。"
    },
    
    // 剣道
    {
        sport: "剣道",
        action: "面打ち踏み込み",
        usedMuscles: ["大腿四頭筋", "三角筋", "上腕三頭筋"],
        unusedMuscles: ["上腕二頭筋"],
        explanation: "膝関節の伸展で踏み込み、肩関節の屈曲・肘関節の伸展で打突。"
    },
    {
        sport: "剣道",
        action: "竹刀を振る",
        usedMuscles: ["三角筋", "上腕三頭筋", "広背筋"],
        unusedMuscles: ["大胸筋"],
        explanation: "肩関節の屈曲→伸展、肘関節の伸展。竹刀を振り下ろす動作。"
    },
    {
        sport: "剣道",
        action: "構え保持",
        usedMuscles: ["三角筋", "僧帽筋", "前腕筋群"],
        unusedMuscles: ["大胸筋"],
        explanation: "肩関節の等尺性収縮、前腕の持続的な筋収縮。構えを維持する。"
    },
    {
        sport: "剣道",
        action: "すり足",
        usedMuscles: ["大腿四頭筋", "内転筋群", "腓腹筋"],
        unusedMuscles: ["ハムストリングス"],
        explanation: "膝関節の軽度屈曲保持、足関節の底屈。床を滑るように移動する。"
    },
    {
        sport: "剣道",
        action: "反応して避ける",
        usedMuscles: ["大腿四頭筋", "腓腹筋", "腹斜筋"],
        unusedMuscles: ["ハムストリングス"],
        explanation: "膝関節の伸展、体幹の側屈・回旋。素早く体を引く動作。"
    },
    
    // 空手
    {
        sport: "空手",
        action: "突き",
        usedMuscles: ["大胸筋", "三角筋", "上腕三頭筋"],
        unusedMuscles: ["広背筋"],
        explanation: "肩関節の水平内転、肘関節の伸展。拳を前方に突き出す動作。"
    },
    {
        sport: "空手",
        action: "蹴り",
        usedMuscles: ["腸腰筋", "大腿四頭筋", "大殿筋"],
        unusedMuscles: ["ハムストリングス"],
        explanation: "股関節の屈曲→伸展、膝関節の伸展。脚を振り上げて蹴る動作。"
    },
    {
        sport: "空手",
        action: "ガード",
        usedMuscles: ["三角筋", "上腕二頭筋", "前腕筋群"],
        unusedMuscles: ["大胸筋"],
        explanation: "肩関節の外転、肘関節の屈曲。腕を上げて防御する動作。"
    },
    {
        sport: "空手",
        action: "ステップイン",
        usedMuscles: ["大腿四頭筋", "大殿筋", "腓腹筋"],
        unusedMuscles: ["ハムストリングス"],
        explanation: "股関節・膝関節の伸展、足関節の底屈。前方へ踏み込む動作。"
    },
    {
        sport: "空手",
        action: "受けで払う",
        usedMuscles: ["三角筋", "前腕筋群", "腹斜筋"],
        unusedMuscles: ["大胸筋"],
        explanation: "肩関節の水平外転、前腕の回旋。相手の攻撃を払いのける動作。"
    },
    
    // バドミントン
    {
        sport: "バドミントン",
        action: "スマッシュ",
        usedMuscles: ["三角筋", "上腕三頭筋", "大胸筋"],
        unusedMuscles: ["上腕二頭筋"],
        explanation: "肩関節の屈曲・内旋、肘関節の伸展。シャトルを上から叩く動作。"
    },
    {
        sport: "バドミントン",
        action: "クリア・ドロップ",
        usedMuscles: ["三角筋", "上腕三頭筋", "前腕筋群"],
        unusedMuscles: ["大胸筋"],
        explanation: "肩関節の屈曲、肘関節の伸展、手関節の制御。高く打ち上げる動作。"
    },
    {
        sport: "バドミントン",
        action: "ラケットスイング",
        usedMuscles: ["三角筋", "大胸筋", "腹斜筋"],
        unusedMuscles: ["広背筋"],
        explanation: "肩関節の水平内転、体幹の回旋。ラケットを振り抜く動作。"
    },
    {
        sport: "バドミントン",
        action: "素早い前後ステップ",
        usedMuscles: ["大腿四頭筋", "腓腹筋", "ハムストリングス"],
        unusedMuscles: ["前脛骨筋"],
        explanation: "股関節・膝関節の屈曲・伸展、足関節の底屈。前後への素早い移動。"
    },
    {
        sport: "バドミントン",
        action: "ジャンプショット",
        usedMuscles: ["大腿四頭筋", "腓腹筋", "三角筋"],
        unusedMuscles: ["ハムストリングス"],
        explanation: "下肢の伸展でジャンプ、肩関節の屈曲でスマッシュ。空中での打突動作。"
    },
    
    // 弓道
    {
        sport: "弓道",
        action: "弓を引く",
        usedMuscles: ["広背筋", "僧帽筋", "三角筋後部"],
        unusedMuscles: ["大胸筋"],
        explanation: "【主要動作】肩関節の水平外転・伸展（広背筋・三角筋後部）、肩甲骨の内転（僧帽筋中部・菱形筋）。引き手側では広背筋が強力に収縮し、肩甲骨を脊柱に近づける。大胸筋は肩関節の水平内転・屈曲筋であり、引く動作とは拮抗する。弓を引く動作は「引く筋肉群」（広背筋・僧帽筋）が主体で、「押す筋肉」（大胸筋）は使用しない。"
    },
    {
        sport: "弓道",
        action: "引き分け動作",
        usedMuscles: ["広背筋", "僧帽筋", "上腕二頭筋"],
        unusedMuscles: ["大胸筋"],
        explanation: "肩関節の水平外転、肘関節の屈曲、肩甲骨の内転。弦を引く動作。"
    },
    {
        sport: "弓道",
        action: "姿勢保持",
        usedMuscles: ["腹直筋", "脊柱起立筋", "大殿筋"],
        unusedMuscles: ["腹斜筋"],
        explanation: "体幹の等尺性収縮、脊柱の伸展保持。正しい姿勢を維持する動作。"
    },
    {
        sport: "弓道",
        action: "狙いを定める静止",
        usedMuscles: ["僧帽筋", "三角筋", "前腕筋群"],
        unusedMuscles: ["大胸筋"],
        explanation: "肩関節・肩甲骨の等尺性収縮。引き絞った状態を保持する動作。"
    },
    {
        sport: "弓道",
        action: "放つ（離れ）",
        usedMuscles: ["広背筋", "僧帽筋", "前腕筋群"],
        unusedMuscles: ["上腕三頭筋"],
        explanation: "手指の伸展、肩甲骨の内転保持。弦を離して矢を放つ動作。"
    }
];
