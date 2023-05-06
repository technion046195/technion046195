---
type: lecture-slides
index: 1
template: slides
slides_pdf: true
---
<div class="slides site-style" style="direction:rtl">
<section class="center">

# הרצאה 1 - מבוא

<div dir="ltr">
<a href="/assets/lecture01_slides.pdf" class="link-button" target="_blank">PDF</a>
</div>
</section><section>

## הסבר בעזרת דוגמא

<br />

> השם מערכות לומדות יכול מאד להטעות, שכן השיטות שבהם משתמשים כיום רחוקות מאד מהלמידה שאנו מכירים מחיי היום יום.

<br /><br /><br />

נדגים כיצד עובדות רוב השיטות בתחום בעזרת דוגמאות.

</section><section>

## תרגיל

<div style="direction:ltr;
            display:grid;
            align-items: center;
            grid-template-columns: 40% 60%;
            grid-template-rows: 150px 150px 150px">
<div>

3, 6, 12, **?**

</div><div></div><div>

1, 1, 2, 3, 5, 8, **?**

</div><div></div><div>

5, 10, 7, 12, 9, 14, **?**

</div><div></div></div>

</section><section>

## תרגיל

<div style="direction:ltr;
            display:grid;
            align-items: center;
            grid-template-columns: 40% 60%;
            grid-template-rows: 150px 150px 150px">
<div>

3, 6, 12, **24**

</div><div>

➭ $n_i=3\times2^i$

</div> <div>

1, 1, 2, 3, 5, 8,
<span class="r-stack" style="display:inline-grid">
<strong class="fragment fade-out" data-fragment-index="1">?</strong>
<strong class="fragment" data-fragment-index="1">13</strong>
</span>

</div><div class="fragment" data-fragment-index="1">

➭ $n_i=n_{i-1}+n_{i-2}$

</div><div>

5, 10, 7, 12, 9, 14,
<span class="r-stack" style="display:inline-grid">
<strong class="fragment fade-out" data-fragment-index="2">?</strong>
<strong class="fragment" data-fragment-index="2">11</strong>
</span>

</div><div class="fragment" data-fragment-index="2">

➭ $n_i=\begin{cases}n_{i-1}+5&i\text{ is odd}\\n_{i-1}-3&i\text{ is even}\end{cases}$

</div></div>

</section><section>

## כיצד אנו פותרים תרגילים כאלה?

<ul>
<li>נחפש חוקיות (מודל).</li>
<li class="fragment">לרוב נחפש את מודל מתוך אוסף של מודלים מוכרים.</li>
<li class="fragment">יתכן יותר ממודל אחד מתאים.</li>
<li class="fragment">נעדיף מודל פשוט על פני מודל מסובך (<a href="https://en.wikipedia.org/wiki/Occam%27s_razor">התער של אוקאם</a>).</li>
<li class="fragment">מודל יכול להכיל פרמטר שיש לקבוע על פי הדוגמאות <br/>(למשל ה2 וה3 בדוגמא הראשונה).</li>
<li class="fragment">לרוב, ככל שהמודל "מסובך יותר" נצטרך יותר דוגמאות.</li>
</ul>

</section><section>

## בחירת המודל

- למצוא מודל שמתאים לדוגמאות זה קל.
- לבחור מבין כל המודלים את המודל הנכון, זה קשה.<br/>(ולרוב בלתי אפשרי)

<div class="fragment">

### נסתכל על הדוגמא הבאה

<div style="direction:ltr;
            text-align:center;
            align-items: center;
            display:grid;
            grid-template-columns: 50% 50%">
<div class="imgbox" style="width:400px" >

![](./output/missing_number.png)

</div><div>

2, 4, **?**, 16

</div></div></div>

</section><section>

## מודלים אפשריים

<div style="direction:ltr;
            text-align:center;
            align-items: center;
            display:grid;
            grid-template-columns: 1fr 1fr 1fr;
            grid-template-rows: 300px 300px">
<div class="imgbox" style="width:300px" >

![](./output/missing_number_exp.png)

</div><div class="imgbox fragment" style="width:300px">

![](./output/missing_number_poly.png)

</div><div class="imgbox fragment" style="width:300px">

![](./output/missing_number_harm.png)

</div> <div class="imgbox fragment" style="width:300px">

![](./output/missing_number_prev.png)

</div><div class="imgbox fragment" style="width:300px">

![](./output/missing_number_spline.png)

</div>

</section><section>

## המודל צריך לדעת להכליל

- יש הרבה מודלים שיכולים להתאים לדוגמאות.
- המטרה היא למצוא מודל שידע להכליל למקרים שעוד לא ראינו.
- כדי לבחור את המודל המתאים עלינו להשתמש בידע הקודם שיש לנו.

<div class="fragment">

בעבור המקרה של: 2, 4, **?**, 16

<br/>

מהניסון הקודם שלנו, אנו יודעים שבעיות כאלה נפוץ להשתמש בסדרה הנדסית. לכן המודל הסביר ביותר הוא:

$$
n_i=2\times2^i
$$

</div>

</section><section>

## מערכות אקראיות

<br/>

- בדוגמא הצגנו מערכת דטרמיניסטית (לא אקראית). זאת אומרת, שבמקום ה$i$ ישב מספר מסויים קבוע.

<br/>

- בפועל, ברוב במערכות שאותם נרצה למדל יהיה רכיב סטוכסטי (אקראי). זאת אומרת, שיתכן שבעבור פרמטרים זהים נקבל התנהגויות שונות.

</section><section>

## מערכות אקראיות - דוגמא

חיזוי זמן נסיעה על פי העומס בכביש (מספר המכוניות על הכביש).
<br/><br/>
מכיוון שזמן הנסיעה תלוי בעוד הרבה גורמים אחרים חוץ מהעומס, ניתן לקבל זמנים שונים בעבור אותו עומס.
<br/><br/>
<div class="imgbox" style="width:600px">

![](./output/drive_prediction.png)

</div>
</section><section>

## המודל גם יטעה לפעמים

<br/>

> כשהמערכת היא אקראית, או מאד מורכבת, לא נצפה למצוא מודל שתמיד צודק. במקום זאת נחפש מודל שטועה כמה שפחות.

<br/><br/><div class="fragment">

במקרים כאלה נעזר בתורת ההסתברות על מנת לתאר את הבעיה והפתרון.

</div>
</section><section>

## אז איך עושים את זה?

הרעיון מאחורי רוב השיטות במערכות לומדות הוא זהה:

1. נגדיר קריטריון מתמטי אשר מודד עד כמה מודל מסויים מצליח לבצע את המשימה.

<div class="fragment">

2. נבחר משפחה רחבה של מודלים בתקווה שלפחות אחד מהם יהיה מוצלח מספיק.

</div><div class="fragment">

3. נחפש מבין כל המודלים במשפחה את המודל המוצלח ביותר.

</div><br/>
<div class="fragment">

(הרעיון פשוט, הביצוע קצת פחות).

<br/>

מרבית הקורס יעסוק בשיטות לביצוע שלושת השלבים האלו.

</div>
</section><section>

## מודלים פרמטריים

אנו נבחר לרוב לייצג את המשפחה של המודלים בעזרת **מודל פרמטרי** (פונקציות בעלות מבנה קבוע עד כדי כמה פרמטרים שאותם ניתן לשנות)

### דוגמאות

<ul>
<li>

פונקציות לינאריות: $f_{\boldsymbol{\theta}}(x)=\theta_1 + \theta_2 x$.

</li><li class="fragment">

כל הפולינומים עד סדר 3: $f_{\boldsymbol{\theta}}(x)=\theta_1 + \theta_2 x + \theta_3 x^2 + \theta_4 x^3$.

</li><li class="fragment">

קומבינציה לינארית של פונקציות: $f_{\boldsymbol{\theta}}(x)=\theta_1 e^x + \theta_2 \sin(x)$.

</li><li class="fragment">

משהו אחר: $f_{\boldsymbol{\theta}}(x)=\theta_1 e^{-(x-\theta_2)^2/\theta_3}$.

</li><li class="fragment">רשת נוירונים.</li>
</ul>

</section><section>

## איך נדאג שהמודל הפרמטרי שלנו יכיל את המודל האופטימאלי?

אנחנו לא!

<br/><br/>

במערכות מורכבות אנחנו כנראה אף פעם לא נוכל למצוא את הפתרון האופטימאלי לבעיה. אנחנו נשאף להגיע כמה שיותר קרוב עליו.

<br/><br/>

<div style="padding-right:100px">

> כל המודלים טועים אבל חלק שימושיים

</div><div style="direction:ltr;font-size:0.7em">George E. P. Box</div>

</section><section>

## בחירת המודל הפרמטרי (משפחת המודלים)

הבחירה של המודל הפרמטרי תשפיע מאד על הפתרון שנקבל

<br/>

<div style="direction:ltr;
            text-align:center;
            align-items: center;
            display:grid;
            grid-template-columns: 1fr 1fr">
<div class="imgbox" style="width:450px" >

![](./output/drive_prediction_linear.png)

</div><div class="imgbox fragment" style="width:450px">

![](./output/drive_prediction_poly_2.png)

</div><div class="imgbox fragment" style="width:450px">

![](./output/drive_prediction_poly_4.png)

</div><div class="imgbox fragment" style="width:450px">

![](./output/drive_prediction_poly_15.png)

</div></div>
</section><section>

## כבר אמרנו קודם, הבעיה היא בעיית הכללה

<div style="direction:ltr;
            text-align:center;
            align-items: center;
            display:grid;
            grid-template-columns: 1fr 1fr 1fr 1fr">
<div class="imgbox" style="width:225px" >

![](./output/drive_prediction_linear.png)

</div><div class="imgbox" style="width:225px">

![](./output/drive_prediction_poly_2.png)

</div><div class="imgbox" style="width:225px">

![](./output/drive_prediction_poly_4.png)

</div><div class="imgbox" style="width:225px">

![](./output/drive_prediction_poly_15.png)

</div></div>

<br/>

- סדר פולינום גבוה יותר -> התאמה טובה יותר לדוגמאות.
- התאמה טובה יותר לדוגמאות לא מעידה על הכללה טובה יותר.
- את המודל הפרמטרי יש לבחור על סמך ידע קודם.

מההיכרות שלנו עם הבעיה אנו מצפים שפונקציית המיפוי תהיה מונוטונית עולה וגם שלא תשתנה בפראות.

<br/>

מבין האופציות הנ"ל, פולינום מסדר 4 הוא הפשרה הטובה ביותר בין ההתאמה לדוגמאות והידע הקודם.

</section><section>

## התאמת מודלים

הרעיון של בניית מודל מתמטי לצורך תיאור של מערכת או לתהליך כל שהוא, הוא למעשה אחד הרעיונות הבסיסיים עליו מושתתים רוב תחומי ההנדסה והמדעים.  

<br/><br/>

- אנו נשתמש בשם prior knowledge (או בקיצור prior) בכדי להתייחס לידע המוקדם.
- אנו נשתמש בשם data בכדי להתייחס לדוגמאות / תצפיות.

</section><section>

## Data vs. Prior

- כאשר המערכת פשוטה, ויש לנו הבנה טובה שלה נסתמך בעיקר על הידע הקודם.
- במקרים אחרים נסתמך הרבה יותר על הdata.

<div class="fragment">

### לדוגמא

#### מודל המבוסס על ידע קודם

מכונית יוצאת מחיפה לתל אביב במהירות קבועה ידועה.<br/>(מודל: מיקום = זמן x מהירות).

#### מודל המצריך שימוש בdata

מהירות המכונית תלויה במשתנים כגון אופי הנהג ומצב הכביש. ניתן לנסות לבנות מודל על סמך מידע מנסיעות קודמות.

</div>
</section><section>

## Data vs. Prior

- כאשר המערכת פשוטה, ויש לנו הבנה טובה שלה נסתמך בעיקר על הידע הקודם.
- במקרים אחרים נסתמך הרבה יותר על הdata.

### אילוסטרציה

<div class="imgbox no-shadow" style="width:867px" >

![](./assets/data_vs_prior.png)

</div>

</section><section>

## איך זה מתקשר למערכות לומדות?

### הגדרה פורמלית

> התחום של מערכות לומדות עוסק באלגוריתמים אשר מנסים להשתמש במידע זמין על מנת לשפר את הביצועים של מכונה במשימה כל שהיא.

</section><section>

## בפועל ...

בפועל התחום של מערכות לומדות מתעסק בעיקר במקרים בהם אין הרבה ידע מקדים ובניית המודל נעשית בעיקר על סמך הdata.

<br /><br /><div class="imgbox no-shadow" style="width:867px" >

![](./assets/data_vs_prior_ml.png)

</div>

</section><section>

## וזה באמת עובד?

<br/><br/><br/>

<div style="width:100%;text-align:center;font-size:1.5em">

הנה כמה דוגמאות לדברים שאותם מערכות לומדות יכולות לעשות:

</div>

</section><section><center>

### לנהוג במכונית מירוץ

<iframe width="560"
        height="315"
        src="https://www.youtube.com/embed/3x3SqeSdrAE?start=26"
        frameborder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen
        ></iframe>

</center></section><section><center>

### לנצח בני אדם  במשחקי לוח ומחשב

<div class="imgbox" style="max-height:500px">

![](./assets/starcraft.gif)

</div>
DeepMind's AlphaStar

</center></section><section><center>

### לכתוב בלוגים

<br/><br/><br/>
<a href="https://adolos.substack.com/archive?sort=new" target="_blank">
Nothing but Words by Liam Porr<br/>
(and Open AI's GPT-3)
</a>

</center></section><section><center>

### לייצר תמונות ריאליסטיות

<br/><br/><br/>
<div style="text-align:center;
            display:grid;
            max-width:100%;
            grid-template-columns: 200px 200px 200px 200px">
<div class="imgbox" style="max-height:500px">

![](./assets/fake_person1.jpeg)

</div>
<div class="imgbox">

![](./assets/fake_person2.jpeg)

</div>
<div class="imgbox">

![](./assets/fake_person3.jpeg)

</div>
<div class="imgbox">

![](./assets/fake_person4.jpeg)

</div>
</div>

<br>
<div style="direction:ltr">
<a href="https://thispersondoesnotexist.com/" target="_blank">https://thispersondoesnotexist.com/</a>
</div>

</center></section><section><center>

### לנהל שיחות טלפון.

<iframe width="560" height="315" src="https://www.youtube.com/embed/D5VN56jQMWM?start=70" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>

</center></section><section>

## מערכות לומדות בחיי היום יום

- מערכות עזר לנהיגה (mobileye).
- זיהוי הונאות בכרטיסי אשראי.
- סינון דואר.
- שיפור תוצאות חיפוש (גוגל)
- התאמת תוכן למשתמש.
- עוזרות וירטואליות (Siri, Alexa, Cortanta, Google Now).

</section><section>

## סוגי בעיות למידה

<div style="font-size:0.8em;
            line-height:1.25;
            display:grid;
            grid-template-columns: 250px 650px;
            grid-template-rows: 150px 150px 150px 150px">
<div class="imgbox" style="max-height:140px">

![](./assets/class.jpg)

</div><div>

**מונחית (Supervised)**<br/>
יש בידינו דוגמאות של קלט ופלט ממיפוי כל שהוא, ואנו מעוניינים להכליל את הדוגמאות למקרה הכללי.

</div><div class="imgbox fragment" data-fragment-index="1" style="max-height:140px">

![](./assets/magnifying_glass.jpg)

</div><div class="fragment" data-fragment-index="1">

**לא מונחית (Unsupervised)**</br>
יש בידינו אוסף של דוגמאות כלשהם ואנו מנסים ללמוד את המאפיינים שלהם.

</div><div class="imgbox fragment" class="fragment" data-fragment-index="2" style="max-height:140px">

![](./assets/stocks_market.jpg)

</div><div class="fragment" data-fragment-index="2">

**מקוונות (Online)**<br/>
אנו מעוניינים להמשיך לעדכן את המודל שלנו בעקבות מידע שממשיך להגיע באופן שוטף.

</div><div class="imgbox fragment" class="fragment" data-fragment-index="3" style="max-height:140px">

![](./assets/tennis.jpg)

</div><div class="fragment" data-fragment-index="3">

**מחיזוקים (Reinforcment)**</br>
אנו מאפשרים לאלגוריתם לבצע אינטרקציה עם המערכת וללמוד מהמשוב שהוא מקבל ממנה (ניסוי וטעיה).

</div></div>

</section><section>

## סוגי בעיות למידה - דוגמאת

<div style="font-size:0.8em;
            line-height:1.25;
            display:grid;
            grid-template-columns: 250px 650px;
            grid-template-rows: 150px 150px 150px 150px">
<div class="imgbox" style="max-height:140px">

![](./assets/class.jpg)

</div><div>

**מונחית (Supervised)**<br/>
זיהוי אובייקטים בתמונה, סינון דואר זבל, סיוע באיבחון רפואי.

</div><div class="imgbox" style="max-height:140px">

![](./assets/magnifying_glass.jpg)

</div><div>

**לא מונחית (Unsupervised)**</br>
ייצור דוגמאות חדשות על סמך ישנות (תמונות, מוזיקה), שינוי מאפיינים (קול של אדם, פנים), דחיסה.

</div><div class="imgbox" style="max-height:140px">

![](./assets/stocks_market.jpg)

</div><div>

**מקוונות (Online)**<br/>
סינון דואר זבל עם עידכון על כל דואר חדש שמגיע.<br/>
חיזוי מחירי מניות עם עדכון על כל מידע חדש שמגיע.

</div><div class="imgbox" style="max-height:140px">

![](./assets/tennis.jpg)

</div><div>

**מחיזוקים (Reinforcment)**</br>
נהיגה אוטונומית, משחק שח, הליכה. <br/>
ברוב המקרים האלגוריתם יתאמן תחילה על סימולטור.

</div></div>

</section><section>

## מה נלמד בקורס

<ul>
<li>בקורס נעסוק בעיקר בבעיות Supervised learning וניגע מעט בUnsupervised learning.</li>
<li class="fragment">נכיר את עולם המושגים והשפה בה משתמשים בתחום.</li>
<li class="fragment">נלמד לבטא בעיות למידה באופן מתימטי.</li>
<li class="fragment">נכיר משפחות שונות של מודלים בהם ניתן השתמש.</li>
<li class="fragment">נלמד על שיטות לבחירת מודל "טוב" מתוך משפחת המודלים.</li>
<li class="fragment">נדון ביכולות והמגבלות של כל אחת מהשיטות והמודלים שנכיר.</li>
</ul>

</section><section>

## איך נלמד בקורס

<br/>

- 13 הרצאות ותרגולים שבועיים.
- 5 תרגלי בית יבש + רטוב. 15% מהציון.
- מבחן סופי 85% מהציון.
- בונוס: תרגילי הכנה של 0.2 נק' לכל תרגיל.

</section><section>

## סילבוס

<div class="imgbox" style="max-width:900px">

![](../assets/course_diagram.png)

</div>
</section><section>

## נוטציות

<br/>

בקורס נשתדל מאד להצמד נצמד לנוטציות המתמטיות המופיעות בספר:

[Deep Learning (by I. Goodfellow, Y. Bengio & A. Courville)](https://www.deeplearningbook.org/).

<br/>

את רשימת הנוטציות המלאה ניתן למצוא [קישור הבא](https://www.deeplearningbook.org/contents/notation.html).

<br/>

בשני התרגולים הראשונים יופיעו הנוטציות הקשורות לאלגברה לינארית והסתברות.

</section><section>

## למה בטכניון?

<div style="direction:ltr;text-align:center">
<a href="http://csrankings.org/#/index?mlmining&world">
<div class="imgbox" style="max-width:100%">

![](./assets/csranking.png)

</div>

CSRanking (2010-2020)

</a>
</div>

</section><section class="center">

# Supervised learning

</section><section>

## Supervised learning (למידה מונחית)

- בעיות supervised learning הן הבסיסיות ביותר בתחום והבנה טובה של בעיות אלו היא הבסיס להבנה של כל שאר הבעיות במערכות לומדות.

<div class="fragment">

- בקורס זה אנו נעסוק בעיקר בבעיות מסוג זה.

</div><div class="fragment">

- על מנת להבין מה הן בעיות supervised learning עלינו ראשית לחזור על הנושא של בעיות חיזוי.

</div>
</section><section>

## בעיית החיזוי

- בבעיות חיזוי אנו מנסים לחזות את ערכו של משתנה אקראי לא ידוע, לרוב על סמך משתנים אקראיים ידועים.

<div class="fragment">

- בעיות חיזוי הן **מאד** נפוצות ומופיעות במגוון רחב של תחומים בהנדסה ומדע.

- בהנדסת חשמל בעיות אלו מופיעות בתחומים כגון עיבוד אותות, תקשורת ספרתית ובקרה.

</div><div class="fragment">

- בעיות חיזוי מלוות אותנו כמעט בכל פעולה יום יומית. לדוגמא האם לקחת מטריה כשיוצאים מהבית.

</div><div class="fragment">

- ביום יום אנחנו לא מנסים לפתור בעיות אלה באופן מתמטי. אנו מחזיקים מודל של הקשרים הסטטיסטים ומשתמשים בו בצורה איכותית.

</div>
</section><section>

## הקשר ל supervised learning

- בבעיות חיזוי קלאסיות, אנו מניחים שהפילוג ידוע.

<div class="fragment">

- בsupervised learning (ובמערכות לומדות) אנו מניחים כי הפילוג אינו ידוע.

</div><div class="fragment">

- במקום הפילוג יש לנו מדגם.

</div><div class="fragment">

- את החזאי נאלץ כעת לבנות על סמך המדגם (במקום על סמך הפילוג).

</div>
</section><section>

## סימונים ושמות

- **Labels** (תויות / תגיות): $\text{y}$ - המשתנה האקראי שאותו אנו מנסים לחזות. (לרוב סקלר)

- **Observations \ measurements** (תצפיות או מדידיות): $\mathbf{x}$ - הוקטור האקראי אשר שעלפיו נרצה לבצע את החיזוי. (לרוב וקטור)

- $\hat{y}$ - תוצאת חיזוי.

- $\hat{y}=h(\boldsymbol{x})$ - פונקציית החיזוי.

- $D$ אורך של הוקטור $\boldsymbol{x}$

</section><section>

## The dataset (המדגם)

המדגם יהיה מורכב מזוגות של $\boldsymbol{x}$ ו $y$ אשר יוצרו מתוך $N$ דגימות **בלתי תלויות**:

$$
\mathcal{D}=\{\boldsymbol{x}^{(i)}, y^{(i)}\}_{i=1}^N
$$

$N$ - מספר הדגימות שבמדגם.

</section><section>

## החזאי האופטימאלי

- כל פונקציה אשר ממפה מ $\boldsymbol{x}$ ל $y$ היא פונקציית חיזוי חוקית.

<div class="fragment">

- היינו מעוניינים למצוא חזאי אשר לעולם לא טועה.

</div><div class="fragment">

- מכיוון ש$\text{y}$ משתנה אקראי לא נוכל לחזותו במדוייק.

</div><div class="fragment">

- אנו צריכים להגדיר דרך להשוות בין הטעויות שאותם מבצעים החזאים שונים. (לדוגמא, הרבה טעויות קטנות או מעט גדולות)

</div>
</section><section>

## Regression vs. Classification

מוקבל לחלק את הבעיות ב supervised learning לשני תתי תחומים:

<br/>

- **בעיות regression (רגרסיה)** - $\text{y}$ רציף.

<br/>

- **בעיות classification (סיווג)** - $\text{y}$ בדיד עם סט ערכים סופי (לרוב קטן).

</section><section>

## דוגמא לבעיית רגרסיה

הבעיה של חיזוי משך הנסיעה

<br/>
<div class="imgbox" style="width:600px">

![](./output/drive_prediction.png)

</div>

</section><section>

## ניסוח פורמלי - חיזוי משך הנסיעה

- $x$ - מספר המכוניות על הכביש באותה נסיעה.
- $\text{y}$ - משך הזמן שלקחה הנסיעה.
- נחפש פונקציית חיזוי $\hat{y}=h(\boldsymbol{x})$.

דוגמא לפונקציית חיזוי פרמטרית:

$$
h_\boldsymbol{\theta}(x;\theta_1,\theta_2)=\theta_1+\theta_2 x
$$

אוסף כל הפונקציות הלינאריות (ליתר דיוק אפיניות).

<br>

בהמשך נעסוק בשאלה של כיצד לבחור את הערכים של $\theta_1$ ו-$\theta_2$.

</section><section>

## בעיית סיווג - זיהוי הונאות בכרטיסי אשראי

נסיון לסווג עסקאות כחשודת להונאה על סמך פרטי העסקה:

- הסכום.
- מרחק העיסקה (נניח המיקום של החנות) מהעיסקה האחרונה.
- מרחק העיסקה מהכתובת של הלקוח.
- השעה ביום.
- אופי המוצרים שהחנות מוכרת (מכולת, מוצרי חשמל, ביגוד, רכב, נדל"ן, וכו')

ניתן לעשות זאת בעזרת supervised learning על ידי שימוש במדגם דוגמאות מהעבר.

</section><section>

## בעיית סיווג לדוגמא - המדגם

בהרצאות נשתמש בבעיה זו כדוגמא ונתייחס למדגם הבא:

<div class="imgbox" style="max-width:500px;background-color:white">

![](../lecture04/output/transactions_dataset.png)

</div>

</section><section>

## בעיית סיווג לדוגמא - החזאי

נרצה למצוא חזאי אשר יחזה עיסקאות חשודות על פי מרחק ומחיר. לדוגמא:

<div class="imgbox" style="max-width:500px;background-color:white">

![](../lecture04/output/transactions_example.png)

</div>

</section>
</div>
