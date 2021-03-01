# Free Cell 新接龍

![](https://i.imgur.com/mAOV0YP.gif)

## 使用技術

- **HTML**
- **SCSS**
- **VanillaJS**

## 實現功能

#### 開啟新遊戲的提示

點擊右方 「NEW」 按鈕會跳出開啟新遊戲的彈跳視窗，選擇開啟一局新的遊戲或者返回當前遊戲

![](https://i.imgur.com/ExHPOkr.gif)

#### 重新開啟該局遊戲的提示

點擊右方 「RESTART」 按鈕會跳出重新開始該局遊戲的彈跳視窗，選擇重新開始該局的遊戲或者返回當前遊戲

![](https://i.imgur.com/0ZNzLX3.gif)

#### 回到上一步(Undo)功能

當卡牌成功放置於上方區塊時，此時右方 「UNDO」 按鈕顯示為可點擊，點擊該按鈕時，能退回到前一次的拖曳結果

![](https://i.imgur.com/zTrDj99.gif)

#### 遊戲時間計時功能(右上角區塊)

遊戲於開局動畫結束後開始計時，記錄遊戲遊玩時間

#### 移動卡牌次數計算功能(右上角區塊)

每次成功移動卡牌到上方區域時，記錄移動的次數

#### 卡牌暫存區(左上四個放置卡牌的區塊)

左方為卡牌暫時存放的區塊，一次只能放置單張卡牌

![](https://i.imgur.com/vYgQpDw.gif)

#### 卡牌完成區(右上四個放置卡牌的區塊)

右方為完成卡牌存放的區塊，可放置多張卡牌，順序由小至大(A 到 K)

![](https://i.imgur.com/mAOV0YP.gif)

## 學習重點紀錄

- [把玩 HTML Drag and Drop API](https://penghuachen.github.io/2021/01/31/%E6%8A%8A%E7%8E%A9-HTML-Drag-and-Drop-API/)
- `e.target`/`e.currentTarget` 的差別(待整理)

## 參考來源

- [The F2E 精神時光屋 - 設計稿](https://challenge.thef2e.com/user/1461?schedule=2812#works-2812)