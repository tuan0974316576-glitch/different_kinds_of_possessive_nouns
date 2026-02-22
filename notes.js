// notes.js
const grammarNotesHTML = `
<div style="margin-bottom: 25px;">
    <h2 style="color: var(--danger-color); border-bottom: 2px solid var(--danger-color); padding-bottom: 8px; margin-bottom: 15px;">📍 放在「名詞前方」的 3 款「的」</h2>
    <p style="font-size: 15px; color: #555; margin-bottom: 15px;">中文所有「的」都是放在名詞前方，但英文「的」只有以下 3 款放在前方：</p>

    <div style="background: var(--light-bg-1); margin-bottom: 15px; padding: 15px; border-radius: 8px; border-left: 5px solid var(--primary-color);">
        <h3 style="color: var(--primary-dark); margin-top: 0; font-size: 18px;">1. 簡單形容詞</h3>
        <p style="margin: 0 0 8px 0; font-size: 15px; color: #444;">只有一個字的形容詞，或有連字號(-)連在一起的形容詞 [happy, sad, high-quality, stress-free, enormous]。<br>名詞前方可以放不只一個簡單形容詞。</p>
        <ul style="margin: 0; padding-left: 20px; font-size: 15px; color: #333;">
            <li>一些甜的蛋糕：Some sweet cakes</li>
            <li>一個高質素的袋：A high-quality bag</li>
            <li>巨大的建築：Enormous buildings</li>
            <li>一個好而且無壓力的環境：A nice and stress-free environment</li>
            <li>很多昂貴但沒有用的產品：Many expensive but useless products</li>
        </ul>
    </div>

    <div style="background: var(--light-bg-1); margin-bottom: 15px; padding: 15px; border-radius: 8px; border-left: 5px solid var(--primary-color);">
        <h3 style="color: var(--primary-dark); margin-top: 0; font-size: 18px;">2. 數字 + 量詞 + 的</h3>
        <p style="margin: 0 0 8px 0; font-size: 15px; color: #444;">數字和量詞之間要加「-」，量詞<b>要用單數, 即不可加s / 寫成眾數的形式</b>。<br>但在現代英文，如果量詞縮寫了，連「-」也可以不用。</p>
        <ul style="margin: 0; padding-left: 20px; font-size: 15px; color: #333;">
            <li>一個5歲的小朋友：A five years old child ❌ / A five-year-old child ✔️</li>
            <li>一個3人的樂隊：A three people band ❌ / A three-person band ✔️</li>
            <li>一條4公里長的橋：
                <br>A 4-kilometre-long bridge ✔️
                <br>A 4-km-long bridge ✔️
                <br>A 4 km long bridge ✔️ (km縮寫，可不加-)
                <br>A 4-kms-long bridge ❌ (有s一定錯)
            </li>
        </ul>
        <p style="margin: 10px 0 0 0; font-size: 14px; color: #d35400;">⚠️ 補充：如果數字+量詞<b>沒有</b>「的」，量詞一般要加 s (除非縮寫)。<br>例如：我是5歲 (I am five years old.) / 那條橋4公里長 (The bridge is 4 km long.)</p>
    </div>

    <div style="background: var(--light-bg-1); margin-bottom: 15px; padding: 15px; border-radius: 8px; border-left: 5px solid var(--primary-color);">
        <h3 style="color: var(--primary-dark); margin-top: 0; font-size: 18px;">3. 生物的 ( 's / s' )</h3>
        <p style="margin: 0 0 8px 0; font-size: 15px; color: #444;">名詞本身沒有s就加 's，有s尾就加 s'。</p>
        <ul style="margin: 0; padding-left: 20px; font-size: 15px; color: #333;">
            <li>湯姆的媽媽：Tom’s mother</li>
            <li>很多學生的目標：Many students’ targets</li>
            <li>那隻貓的尾巴：The cat’s tail</li>
            <li>一些動物的足印：Some animals’ footsteps</li>
        </ul>
    </div>
</div>

<div style="margin-bottom: 25px;">
    <h2 style="color: var(--secondary-dark); border-bottom: 2px solid var(--secondary-dark); padding-bottom: 8px; margin-bottom: 15px;">📍 放在「名詞後方」的「的」</h2>
    <p style="font-size: 15px; color: #555; margin-bottom: 15px;">除了上述 3 款，其他英文的「的」都會放在名詞的<b>後方</b>修飾。</p>

    <div style="background: var(--light-bg-2); margin-bottom: 10px; padding: 15px; border-radius: 8px; border-left: 5px solid var(--secondary-color);">
        <h4 style="margin: 0 0 5px 0; color: var(--secondary-dark); font-size: 16px;">1. 有 (名詞) 的 = with</h4>
        <ul style="margin: 0; padding-left: 20px; font-size: 15px;">
            <li>有很多窗戶的建築：buildings with many windows</li>
            <li>一部有很多問題的電腦：a computer with many problems</li>
        </ul>
    </div>

    <div style="background: var(--light-bg-2); margin-bottom: 10px; padding: 15px; border-radius: 8px; border-left: 5px solid var(--secondary-color);">
        <h4 style="margin: 0 0 5px 0; color: var(--secondary-dark); font-size: 16px;">2. 沒有 (名詞) 的 = without</h4>
        <ul style="margin: 0; padding-left: 20px; font-size: 15px;">
            <li>一部沒有任何按鍵的電話：A phone without any buttons</li>
            <li>一本沒有任何圖片的書：A book without any pictures</li>
        </ul>
    </div>

    <div style="background: var(--light-bg-2); margin-bottom: 10px; padding: 15px; border-radius: 8px; border-left: 5px solid var(--secondary-color);">
        <h4 style="margin: 0 0 5px 0; color: var(--secondary-dark); font-size: 16px;">3. 關於...的 = about</h4>
        <ul style="margin: 0; padding-left: 20px; font-size: 15px;">
            <li>一本關於中國的書：A book about China</li>
        </ul>
    </div>

    <div style="background: var(--light-bg-2); margin-bottom: 10px; padding: 15px; border-radius: 8px; border-left: 5px solid var(--secondary-color);">
        <h4 style="margin: 0 0 5px 0; color: var(--secondary-dark); font-size: 16px;">4. 主動動詞+的 / Modal verb+的 = who(人) / which(非人)</h4>
        <p style="margin: 0 0 8px 0; font-size: 14px; color: #555;">(Modal verb = can/will/should/may/must)。注意不+動詞 = do not / does not / did not。</p>
        <ul style="margin: 0; padding-left: 20px; font-size: 15px;">
            <li>一本可以幫助你的書：A book which can help you</li>
            <li>常常幫助我的老師：teachers who often help me</li>
            <li>一個不討厭英文的學生：A student who does not hate English</li>
        </ul>
    </div>

<div style="background: var(--light-bg-2); margin-bottom: 10px; padding: 15px; border-radius: 8px; border-left: 5px solid var(--secondary-color);">
        <h4 style="margin: 0 0 5px 0; color: var(--secondary-dark); font-size: 16px;">5. 被動動詞+的 = 直接寫 p.p.</h4>
        <p style="margin: 0 0 8px 0; font-size: 14px; color: #555;">[考慮動詞和名詞的關係] 被動動詞 = (被 / 由 / 名詞是被...)</p>
        <ul style="margin: 0 0 10px 0; padding-left: 20px; font-size: 15px;">
            <li>一個常常被罰的學生：A student often punished</li>
            <li>一本我爺爺寫的書：A book written by my grandpa</li>
            <li>那隻昨天被捉的狗：The dog caught yesterday</li>
        </ul>
        
        <p style="margin: 0 0 5px 0; font-size: 14px; color: #d35400;"><b>⚠️ 變化寫法 1：加否定 (直接加 not)</b></p>
        <ul style="margin: 0 0 10px 0; padding-left: 20px; font-size: 15px;">
            <li>一個不被教練重視的球員：A player not valued by the coach</li>
            <li>一項以前不被公眾支持的政策：A policy not supported by the public in the past</li>
        </ul>

        <p style="margin: 0 0 5px 0; font-size: 14px; color: #d35400;"><b>⚠️ 變化寫法 2：加副詞 (如 still / even)</b></p>
        <ul style="margin: 0; padding-left: 20px; font-size: 15px;">
            <li>一個仍然沒有被回應的問題：A question <b>still</b> not responded to<span style="font-size: 13px; color: #777;">[still 加在 not 前方(時間類/頻率類)]</span></li>
            <li>一個甚至沒有在第一輪被挑選的球員：A player not <b>even</b> picked in the first round <span style="font-size: 13px; color: #777;">[even 加在 not 後方(程度類)]</span></li>
        </ul>
    </div>

<div style="background: var(--light-bg-2); margin-bottom: 10px; padding: 15px; border-radius: 8px; border-left: 5px solid var(--secondary-color);">
    <h4 style="margin: 0 0 5px 0; color: var(--secondary-dark); font-size: 16px;">6. 形容詞片語+的 (形容詞 + 介詞) = 直接寫在名詞後方</h4>
    <p style="margin: 0 0 8px 0; font-size: 14px; color: #555;">[當形容詞帶著一個介詞尾巴時，整個片語必須放在名詞後面]</p>
    <ul style="margin: 0 0 10px 0; padding-left: 20px; font-size: 15px;">
        <li>害怕鬼的小朋友：Children afraid of ghosts</li>
        <li>對歷史感興趣的學生：Students interested in history</li>
    </ul>

    <p style="margin: 0 0 5px 0; font-size: 14px; color: #d35400;"><b>⚠️ 變化寫法：加否定與副詞 (位置規則與 p.p. 相同)</b></p>
    <ul style="margin: 0; padding-left: 20px; font-size: 15px;">
        <li>一個不熱愛英文的小朋友：A child <b>not</b> fond of English</li>
        <li>一個仍然害怕黑的男孩：A boy <b>still</b> afraid of the dark <span style="font-size: 13px; color: #777;">[still 在前方]</span></li>
        <li>一個甚至不對音樂感興趣的學生：A student <b>not even</b> interested in music <span style="font-size: 13px; color: #777;">[not even 連用]</span></li>
    </ul>
</div>

    <div style="background: var(--light-bg-2); margin-bottom: 10px; padding: 15px; border-radius: 8px; border-left: 5px solid var(--secondary-color);">
        <h4 style="margin: 0 0 5px 0; color: var(--secondary-dark); font-size: 16px;">7. 句子 + 的 = 直接寫句子在名詞後方 [句子 = 主語 + 動詞]</h4>
        <ul style="margin: 0; padding-left: 20px; font-size: 15px;">
            <li>一間我十分推薦的酒店：A hotel I highly recommend</li>
            <li>她以前十分討厭的那個男孩：The boy she really hated in the past</li>
        </ul>
    </div>

    <div style="background: var(--light-bg-2); margin-bottom: 10px; padding: 15px; border-radius: 8px; border-left: 5px solid var(--secondary-color);">
        <h4 style="margin: 0 0 5px 0; color: var(--secondary-dark); font-size: 16px;">8. 死物的死物 = the...of... (兩名詞前後調轉)</h4>
        <ul style="margin: 0; padding-left: 20px; font-size: 15px;">
            <li>這電腦的顏色：the colour of this computer</li>
            <li>世界的人口：The population of the world</li>
        </ul>
        <p style="margin: 8px 0 0 0; font-size: 14px; color: #d35400;">⚠️ 現代英文中，機構/國家/城市如果不當作地方時，也可以用 's (如：Tokyo's metro / Google's products)</p>
    </div>

    <div style="background: var(--light-bg-2); margin-bottom: 10px; padding: 15px; border-radius: 8px; border-left: 5px solid var(--secondary-color);">
        <h4 style="margin: 0 0 5px 0; color: var(--secondary-dark); font-size: 16px;">9. 地方 + 的 = 名詞 + 地方介詞 + 地方</h4>
        <p style="margin: 0 0 8px 0; font-size: 14px; color: #555;">(here / there / overseas / abroad 不用加介詞。一般來說，科技/島嶼用 on，功能性建築用 at，其他用in)</p>
        <ul style="margin: 0; padding-left: 20px; font-size: 15px;">
            <li>這裡的建築：the buildings here</li>
            <li>Instagram 的照片：photos on Instagram</li>
            <li>機場的餐廳：the restaurants at the airport</li>
        </ul>
    </div>

    <div style="background: var(--light-bg-2); margin-bottom: 10px; padding: 15px; border-radius: 8px; border-left: 5px solid var(--secondary-color);">
        <h4 style="margin: 0 0 5px 0; color: var(--secondary-dark); font-size: 16px;">10. 時間 + 的 = 名詞 + 時間介詞 + 時間</h4>
        <p style="margin: 0 0 8px 0; font-size: 14px; color: #555;">(today / tomorrow / last / next / every / each 不用加介詞。時段用 in，日子用 on，一刻/週末/節日用 at)</p>
        <ul style="margin: 0; padding-left: 20px; font-size: 15px;">
            <li>明天的會議：The meeting tomorrow</li>
            <li>週末的活動：activities at weekends</li>
        </ul>
    </div>
</div>
`;
