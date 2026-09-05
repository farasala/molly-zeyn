/* Elementary (A1–A2) — 12 units, lessons A/B/C, sequenced to run in parallel with an
   English File 4e Elementary class. All texts, examples and exercises here are original:
   only the syllabus (topic + grammar point + lexical set per file) follows the course map. */
(function () {
  const U = [];

  /* ============================ UNIT 1 ============================ */
  U.push({
    n: 1, title: 'Hello', theme: 'Introductions & personal information', accent: 'pink',
    practical: 'Practical English — checking in at a hotel',
    lessons: [
      {
        id: '1A', title: 'Nice to meet you', g: 'verb be — positive', v: 'Greetings & personal information',
        grammar: {
          h: 'verb <b>be</b> — positive (+)',
          rows: [
            { label: 'Full form', items: ['I am', 'you are', 'he / she / it is', 'we are', 'they are'] },
            { label: 'Contraction', items: ["I'm", "you're", "he's / she's / it's", "we're", "they're"] },
            { label: 'In sentences', items: ["I'm Farhat.", "She's my teacher.", "We're in class."] }
          ],
          notes: [
            'Every English sentence needs a verb. With jobs, nationalities and places that verb is usually <b>be</b>.',
            'We use contractions when we speak: <i>I am</i> → <i>I\'m</i>.',
            'Use <b>a / an</b> before a job: <i>She\'s a doctor.</i>'
          ]
        },
        vocab: [
          { w: 'first name', ipa: '/ˈfɜːst neɪm/', pos: 'n', def: 'the name your parents chose for you', ex: 'My first name is Anna.' },
          { w: 'surname', ipa: '/ˈsɜːneɪm/', pos: 'n', def: 'your family name', ex: 'Her surname is Petrova.' },
          { w: 'address', ipa: '/əˈdres/', pos: 'n', def: 'where you live', ex: 'What is your address?' },
          { w: 'phone number', ipa: '/fəʊn ˈnʌmbə/', pos: 'n', def: 'the number people call you on', ex: 'This is my new phone number.' },
          { w: 'email', ipa: '/ˈiːmeɪl/', pos: 'n', def: 'an internet address for messages', ex: 'Send me an email tonight.' },
          { w: 'age', ipa: '/eɪdʒ/', pos: 'n', def: 'how old a person is', ex: 'We are the same age.' },
          { w: 'Hi', ipa: '/haɪ/', pos: 'phr', def: 'an informal hello', ex: 'Hi! How are you?' },
          { w: 'Bye', ipa: '/baɪ/', pos: 'phr', def: 'an informal goodbye', ex: 'Bye! See you on Friday.' },
          { w: 'fine', ipa: '/faɪn/', pos: 'adj', def: 'well, with no problem', ex: "I'm fine, thanks." },
          { w: 'thanks', ipa: '/θæŋks/', pos: 'phr', def: 'a short thank you', ex: 'Thanks a lot!' }
        ],
        ex: [
          { t: 'mc', q: 'She ___ my English teacher.', o: ['am', 'is', 'are'], a: 1 },
          { t: 'mc', q: '___ from Almaty.', o: ["I'm", "I is", "I are"], a: 0 },
          { t: 'gap', q: 'My name ___ Farhat.', a: 'is', hint: 'be' },
          { t: 'gap', q: 'They ___ students in my class.', a: 'are', hint: 'be' },
          { t: 'order', a: "I'm a new student here." },
          { t: 'order', a: "She is my sister." },
          { t: 'transform', instr: 'Write the contraction.', q: 'You are late.', a: ["You're late."] },
          { t: 'transform', instr: 'Write the contraction.', q: 'He is a doctor.', a: ["He's a doctor."] },
          { t: 'match', pairs: [['surname', 'your family name'], ['age', 'how old you are'], ['address', 'where you live'], ['email', 'an internet address for messages']] },
          { t: 'dictation', a: "Hi! My name is Anna and I'm a student." },
          { t: 'listen', text: 'Good morning. My first name is Sara and my surname is Nazarova. I am twenty-three years old.', q: 'What is her surname?', o: ['Sara', 'Nazarova', 'Morning'], a: 1 }
        ],
        speak: [
          { p: 'Introduce yourself: name, city, job or studies.', model: "Hi, I'm Ayan. I'm from Almaty and I'm a student." },
          { p: 'Ask your partner three personal questions.', model: "What's your surname? What's your phone number? How old are you?" },
          { p: 'Introduce your partner to the class.', model: "This is Dana. She's from Astana and she's a nurse." }
        ]
      },
      {
        id: '1B', title: 'Where are you from?', g: 'verb be — negative & questions', v: 'Countries & nationalities',
        grammar: {
          h: 'verb <b>be</b> — negative (−) and questions (?)',
          rows: [
            { label: 'Negative', items: ["I'm not Turkish.", "He isn't at home.", "They aren't ready."] },
            { label: 'Questions', items: ['Am I late?', 'Is she English?', 'Are they teachers?'] },
            { label: 'Short answers', items: ["Yes, I am. / No, I'm not.", "Yes, she is. / No, she isn't.", "Yes, they are. / No, they aren't."] }
          ],
          notes: [
            'In questions, <b>be</b> goes before the person: <i>Is he …?</i> — not <i>He is …?</i>',
            'Never use a contraction in a positive short answer: <i>Yes, I am.</i> ✓ &nbsp; <i>Yes, I\'m.</i> ✗',
            'Nationality adjectives always start with a capital letter: <i>Kazakh, Polish, Japanese</i>.'
          ]
        },
        vocab: [
          { w: 'Kazakhstan / Kazakh', ipa: '/ˌkæzækˈstɑːn/', pos: 'n / adj', def: 'the country and its nationality', ex: "I'm from Kazakhstan. I'm Kazakh." },
          { w: 'Turkey / Turkish', ipa: '/ˈtɜːki/', pos: 'n / adj', def: 'the country and its nationality', ex: 'Istanbul is in Turkey.' },
          { w: 'Japan / Japanese', ipa: '/dʒəˈpæn/', pos: 'n / adj', def: 'the country and its nationality', ex: 'Japanese food is popular here.' },
          { w: 'Poland / Polish', ipa: '/ˈpəʊlənd/', pos: 'n / adj', def: 'the country and its nationality', ex: 'She is Polish.' },
          { w: 'Brazil / Brazilian', ipa: '/brəˈzɪl/', pos: 'n / adj', def: 'the country and its nationality', ex: 'Brazil is in South America.' },
          { w: 'Spain / Spanish', ipa: '/speɪn/', pos: 'n / adj', def: 'the country and its nationality', ex: 'Madrid is the capital of Spain.' },
          { w: 'capital', ipa: '/ˈkæpɪtl/', pos: 'n', def: 'the main city of a country', ex: 'Astana is the capital.' },
          { w: 'country', ipa: '/ˈkʌntri/', pos: 'n', def: 'a place like Italy or Egypt', ex: 'How many countries are in Europe?' },
          { w: 'city', ipa: '/ˈsɪti/', pos: 'n', def: 'a big town', ex: 'Almaty is a big city.' },
          { w: 'language', ipa: '/ˈlæŋɡwɪdʒ/', pos: 'n', def: 'English, Kazakh, Russian …', ex: 'How many languages do you speak?' }
        ],
        ex: [
          { t: 'mc', q: '___ she from Poland?', o: ['Is', 'Are', 'Am'], a: 0 },
          { t: 'mc', q: 'Are you Turkish? — No, ___.', o: ["I'm not", 'I am not Turkey', 'not I am'], a: 0 },
          { t: 'gap', q: "We ___ (not) tired. We're fine.", a: "aren't", hint: "are not → aren't" },
          { t: 'gap', q: '___ they in the classroom?', a: 'Are', hint: 'question with be' },
          { t: 'order', a: "Where are you from?" },
          { t: 'order', a: "He isn't Spanish." },
          { t: 'transform', instr: 'Make it negative.', q: 'She is Japanese.', a: ["She isn't Japanese.", 'She is not Japanese.'] },
          { t: 'transform', instr: 'Make it a question.', q: 'They are teachers.', a: ['Are they teachers?'] },
          { t: 'match', pairs: [['Japan', 'Japanese'], ['Poland', 'Polish'], ['Brazil', 'Brazilian'], ['Spain', 'Spanish']] },
          { t: 'dictation', a: "I'm not Turkish. I'm from Kazakhstan." },
          { t: 'listen', text: "Hello. I am Marek. I am not English — I am Polish, from Krakow.", q: 'Where is Marek from?', o: ['England', 'Poland', 'Kazakhstan'], a: 1 }
        ],
        speak: [
          { p: 'Ask and answer: Where are you from? Is it a big city?', model: "I'm from Shymkent. Yes, it's quite big." },
          { p: 'Guess your partner\'s three favourite countries with yes/no questions.', model: 'Is it in Europe? Is it Italy?' },
          { p: 'Say one true and one false sentence about a country. Partner corrects the false one.', model: "Paris is in Spain. — No, it isn't. It's in France." }
        ]
      },
      {
        id: '1C', title: 'In the classroom', g: 'possessive adjectives; a / an', v: 'Classroom objects & language',
        grammar: {
          h: 'Possessive adjectives &nbsp;·&nbsp; <b>a / an</b>',
          rows: [
            { label: 'Possessives', items: ['my, your, his, her, its, our, their'] },
            { label: 'Examples', items: ['This is <b>my</b> book.', "<b>Her</b> name is Dana.", "<b>Their</b> teacher is British."] },
            { label: 'a / an', items: ['<b>a</b> pen, <b>a</b> chair, <b>a</b> window', '<b>an</b> email, <b>an</b> umbrella, <b>an</b> apple'] }
          ],
          notes: [
            'Possessive adjectives never change with plural nouns: <i>my book, my books</i>.',
            'Use <b>an</b> before a vowel <i>sound</i> (a, e, i, o, u), <b>a</b> before all other sounds.',
            '<i>his</i> = of a man, <i>her</i> = of a woman. The owner decides the word, not the object.'
          ]
        },
        vocab: [
          { w: 'board', ipa: '/bɔːd/', pos: 'n', def: 'the white or black surface the teacher writes on', ex: 'Look at the board, please.' },
          { w: 'desk', ipa: '/desk/', pos: 'n', def: 'a table you work at', ex: 'My laptop is on the desk.' },
          { w: 'chair', ipa: '/tʃeə/', pos: 'n', def: 'you sit on it', ex: 'Take a chair.' },
          { w: 'window', ipa: '/ˈwɪndəʊ/', pos: 'n', def: 'you see outside through it', ex: 'The window is open.' },
          { w: 'homework', ipa: '/ˈhəʊmwɜːk/', pos: 'n', def: 'work you do after the lesson', ex: 'The homework is easy today.' },
          { w: 'Open your books.', ipa: '/ˈəʊpən jɔː bʊks/', pos: 'phr', def: 'a classroom instruction', ex: 'Open your books at page ten.' },
          { w: "I don't understand.", ipa: '/aɪ dəʊnt ʌndəˈstænd/', pos: 'phr', def: 'you say this when something is not clear', ex: "Sorry, I don't understand." },
          { w: 'How do you spell it?', ipa: '/haʊ də ju spel ɪt/', pos: 'phr', def: 'ask about the letters of a word', ex: 'How do you spell it? — D-A-N-A.' },
          { w: 'Can you repeat that?', ipa: '/kæn ju rɪˈpiːt ðæt/', pos: 'phr', def: 'ask to hear something again', ex: 'Can you repeat that, please?' },
          { w: 'Work in pairs.', ipa: '/wɜːk ɪn peəz/', pos: 'phr', def: 'work with one other student', ex: 'Work in pairs and compare answers.' }
        ],
        ex: [
          { t: 'mc', q: 'This is Dana and this is ___ brother.', o: ['his', 'her', 'their'], a: 1 },
          { t: 'mc', q: "It's ___ umbrella.", o: ['a', 'an', '—'], a: 1 },
          { t: 'gap', q: 'We love ___ new classroom.', a: 'our', hint: 'possessive of we' },
          { t: 'gap', q: 'Is this ___ email address? — Yes, mine.', a: 'my', hint: 'possessive of I' },
          { t: 'order', a: "Open your books, please." },
          { t: 'order', a: "How do you spell your surname?" },
          { t: 'transform', instr: 'Add a or an.', q: '___ identity card', a: ['an identity card'] },
          { t: 'transform', instr: 'Add a or an.', q: '___ chair', a: ['a chair'] },
          { t: 'match', pairs: [['I', 'my'], ['he', 'his'], ['she', 'her'], ['they', 'their']] },
          { t: 'dictation', a: "Sorry, I don't understand. Can you repeat that?" },
          { t: 'listen', text: 'Open your books at page fourteen and work in pairs.', q: 'Which page?', o: ['4', '14', '40'], a: 1 }
        ],
        speak: [
          { p: 'Point at five things in your room and name them in English.', model: "This is my desk. That's a window." },
          { p: 'Spell your name, your city and your street for your partner.', model: 'A-L-M-A-T-Y.' },
          { p: 'Ask for help in three different ways.', model: "I don't understand. Can you repeat that? How do you spell it?" }
        ]
      }
    ],
    test: [
      { t: 'mc', q: 'My parents ___ from Turkey.', o: ['is', 'are', 'am'], a: 1 },
      { t: 'mc', q: '___ you a teacher? — Yes, I am.', o: ['Is', 'Am', 'Are'], a: 2 },
      { t: 'gap', q: "She ___ (not) at work today.", a: "isn't" },
      { t: 'gap', q: 'This is Ali and that is ___ wife.', a: 'his' },
      { t: 'order', a: "Where is your teacher from?" },
      { t: 'transform', instr: 'Make it a question.', q: 'He is Brazilian.', a: ['Is he Brazilian?'] },
      { t: 'match', pairs: [['first name', 'Anna'], ['surname', 'Petrova'], ['age', 'twenty-five'], ['city', 'Almaty']] },
      { t: 'dictation', a: "They aren't students. They're teachers." }
    ]
  });

  /* ============================ UNIT 2 ============================ */
  U.push({
    n: 2, title: 'Things', theme: 'Objects, colours & feelings', accent: 'teal',
    practical: 'Practical English — in a taxi, giving simple directions',
    lessons: [
      {
        id: '2A', title: "What's this?", g: 'singular & plural nouns', v: 'Everyday things',
        grammar: {
          h: 'Singular and plural nouns',
          rows: [
            { label: 'Regular', items: ['a key → two keys', 'a ticket → six tickets'] },
            { label: '+ es / ies', items: ['a watch → watches', 'a diary → diaries'] },
            { label: 'Irregular', items: ['a person → people', 'a child → children', 'a woman → women'] },
            { label: 'Always plural', items: ['glasses, sunglasses, headphones, scissors, jeans'] }
          ],
          notes: [
            'Drop <b>a / an</b> in the plural: <i>a key</i> → <i>keys</i> (not <i>a keys</i>).',
            'Nouns ending in consonant + <i>y</i> change to <b>-ies</b>: <i>diary → diaries</i>.',
            'For "always plural" words use <i>These are …</i> and <i>a pair of …</i>'
          ]
        },
        vocab: [
          { w: 'key', ipa: '/kiː/', pos: 'n', def: 'you open a door with it', ex: 'Where are my keys?' },
          { w: 'wallet', ipa: '/ˈwɒlɪt/', pos: 'n', def: 'you keep money and cards in it', ex: 'His wallet is black.' },
          { w: 'charger', ipa: '/ˈtʃɑːdʒə/', pos: 'n', def: 'it gives your phone power', ex: 'Have you got a charger?' },
          { w: 'umbrella', ipa: '/ʌmˈbrelə/', pos: 'n', def: 'you use it in the rain', ex: 'Take an umbrella today.' },
          { w: 'ticket', ipa: '/ˈtɪkɪt/', pos: 'n', def: 'you need it to travel or enter', ex: 'Two tickets, please.' },
          { w: 'glasses', ipa: '/ˈɡlɑːsɪz/', pos: 'n pl', def: 'you wear them to see better', ex: 'My glasses are on the desk.' },
          { w: 'headphones', ipa: '/ˈhedfəʊnz/', pos: 'n pl', def: 'you listen to music with them', ex: 'These headphones are new.' },
          { w: 'watch', ipa: '/wɒtʃ/', pos: 'n', def: 'it shows the time on your arm', ex: 'That watch is expensive.' },
          { w: 'coin', ipa: '/kɔɪn/', pos: 'n', def: 'metal money', ex: 'I have two coins.' },
          { w: 'tissue', ipa: '/ˈtɪʃuː/', pos: 'n', def: 'soft paper for your nose', ex: 'Have you got a tissue?' }
        ],
        ex: [
          { t: 'mc', q: 'Plural of <i>watch</i>:', o: ['watchs', 'watches', 'watchies'], a: 1 },
          { t: 'mc', q: '___ are my sunglasses.', o: ['This', 'These', 'It'], a: 1 },
          { t: 'gap', q: 'I have three ___ (diary) at home.', a: 'diaries' },
          { t: 'gap', q: 'There are twenty ___ (person) in the room.', a: 'people' },
          { t: 'order', a: "These are my headphones." },
          { t: 'order', a: "What is this in English?" },
          { t: 'transform', instr: 'Make it plural.', q: 'a key', a: ['keys'] },
          { t: 'transform', instr: 'Make it plural.', q: 'a child', a: ['children'] },
          { t: 'match', pairs: [['charger', 'it gives your phone power'], ['umbrella', 'you use it in the rain'], ['wallet', 'you keep cards in it'], ['ticket', 'you need it to travel']] },
          { t: 'dictation', a: "My keys and my wallet are in my bag." },
          { t: 'listen', text: "Excuse me, is this your umbrella? — No, it isn't. My umbrella is blue.", q: 'What colour is her umbrella?', o: ['black', 'blue', 'green'], a: 1 }
        ],
        speak: [
          { p: 'Empty your bag or pockets. Name six things in English.', model: "This is a charger. These are my keys." },
          { p: 'Ask your partner: Have you got a ticket / a tissue / an umbrella?', model: "Have you got a charger? — Yes, I have." },
          { p: 'Describe one object; your partner guesses it.', model: 'You use it in the rain. — An umbrella!' }
        ]
      },
      {
        id: '2B', title: 'Describing things', g: 'adjectives', v: 'Common adjectives & colours',
        grammar: {
          h: 'Adjectives',
          rows: [
            { label: 'Before a noun', items: ['a <b>big</b> city', 'an <b>expensive</b> watch', '<b>black</b> shoes'] },
            { label: 'After be', items: ['The city is <b>big</b>.', 'These shoes are <b>black</b>.'] },
            { label: 'Modifiers', items: ['It\'s <b>very</b> cheap.', "It's <b>quite</b> old.", "It's <b>really</b> beautiful."] }
          ],
          notes: [
            'Adjectives never take an <b>-s</b>: <i>black shoes</i> ✓ &nbsp; <i>blacks shoes</i> ✗',
            'The adjective goes <b>before</b> the noun: <i>a new phone</i> — not <i>a phone new</i>.',
            '<b>very</b> is stronger than <b>quite</b>.'
          ]
        },
        vocab: [
          { w: 'big', ipa: '/bɪɡ/', pos: 'adj', def: 'large in size', ex: 'They live in a big house.' },
          { w: 'small', ipa: '/smɔːl/', pos: 'adj', def: 'not big', ex: 'My flat is small but nice.' },
          { w: 'cheap', ipa: '/tʃiːp/', pos: 'adj', def: 'it costs little money', ex: 'This café is cheap.' },
          { w: 'expensive', ipa: '/ɪkˈspensɪv/', pos: 'adj', def: 'it costs a lot of money', ex: 'That hotel is too expensive.' },
          { w: 'new', ipa: '/njuː/', pos: 'adj', def: 'not old', ex: 'She has a new laptop.' },
          { w: 'old', ipa: '/əʊld/', pos: 'adj', def: 'not new; not young', ex: 'My car is very old.' },
          { w: 'beautiful', ipa: '/ˈbjuːtɪfl/', pos: 'adj', def: 'very nice to look at', ex: 'What a beautiful city!' },
          { w: 'difficult', ipa: '/ˈdɪfɪkəlt/', pos: 'adj', def: 'not easy', ex: 'English spelling is difficult.' },
          { w: 'grey', ipa: '/ɡreɪ/', pos: 'adj', def: 'the colour between black and white', ex: 'His jacket is grey.' },
          { w: 'purple', ipa: '/ˈpɜːpl/', pos: 'adj', def: 'the colour of red and blue together', ex: 'I like that purple bag.' }
        ],
        ex: [
          { t: 'mc', q: 'Choose the correct sentence.', o: ['They are shoes black.', 'They are blacks shoes.', 'They are black shoes.'], a: 2 },
          { t: 'mc', q: 'This restaurant is ___ cheap.', o: ['a', 'very', 'an'], a: 1 },
          { t: 'gap', q: 'Almaty is a ___ city. (big)', a: 'big' },
          { t: 'gap', q: 'My phone is quite ___. (old ↔ new)', a: 'old' },
          { t: 'order', a: "It is a very expensive watch." },
          { t: 'order', a: "Her new car is grey." },
          { t: 'transform', instr: 'Put the adjective in the right place.', q: 'a city (beautiful)', a: ['a beautiful city'] },
          { t: 'transform', instr: 'Write the opposite adjective.', q: 'expensive', a: ['cheap'] },
          { t: 'match', pairs: [['big', 'small'], ['new', 'old'], ['cheap', 'expensive'], ['easy', 'difficult']] },
          { t: 'dictation', a: "It's a very beautiful old city." },
          { t: 'listen', text: 'I want the small purple bag, not the big grey one.', q: 'Which bag does she want?', o: ['big and grey', 'small and purple', 'small and grey'], a: 1 }
        ],
        speak: [
          { p: 'Describe three things you are wearing (colour + adjective).', model: 'These are new black jeans.' },
          { p: 'Your city: name two things that are cheap and two that are expensive.', model: 'Taxis are quite cheap here.' },
          { p: 'Describe a room in your home in five sentences.', model: "My kitchen is small but very nice. The walls are white." }
        ]
      },
      {
        id: '2C', title: 'This or that?', g: 'this / that / these / those; imperatives', v: 'Feelings',
        grammar: {
          h: '<b>this / that / these / those</b> &nbsp;·&nbsp; imperatives',
          rows: [
            { label: 'Near', items: ['<b>this</b> ticket (one)', '<b>these</b> tickets (more)'] },
            { label: 'Far', items: ['<b>that</b> ticket (one)', '<b>those</b> tickets (more)'] },
            { label: 'Imperatives', items: ['Sit down.', "Don't worry.", "Let's go.", "Let's not stop."] }
          ],
          notes: [
            'Use <b>this / these</b> for things here, <b>that / those</b> for things over there.',
            'The imperative has no subject: <i>Close the door.</i> — not <i>You close the door.</i>',
            'Feelings use <b>be</b>, not <i>have</i>: <i>I\'m hungry.</i> ✓ &nbsp; <i>I have hunger.</i> ✗'
          ]
        },
        vocab: [
          { w: 'hungry', ipa: '/ˈhʌŋɡri/', pos: 'adj', def: 'you want to eat', ex: "I'm hungry — let's have lunch." },
          { w: 'thirsty', ipa: '/ˈθɜːsti/', pos: 'adj', def: 'you want to drink', ex: "I'm thirsty. Where's the water?" },
          { w: 'tired', ipa: '/ˈtaɪəd/', pos: 'adj', def: 'you need to sleep or rest', ex: "She's tired after work." },
          { w: 'happy', ipa: '/ˈhæpi/', pos: 'adj', def: 'you feel good', ex: "I'm happy you're here." },
          { w: 'sad', ipa: '/sæd/', pos: 'adj', def: 'not happy', ex: 'He looks sad today.' },
          { w: 'angry', ipa: '/ˈæŋɡri/', pos: 'adj', def: 'you feel bad about something', ex: "I'm angry with my brother." },
          { w: 'worried', ipa: '/ˈwʌrid/', pos: 'adj', def: 'you think something bad can happen', ex: "I'm worried about the test." },
          { w: 'bored', ipa: '/bɔːd/', pos: 'adj', def: 'nothing is interesting for you', ex: "I'm bored — let's go out." },
          { w: 'stressed', ipa: '/strest/', pos: 'adj', def: 'you have too much to do', ex: "I'm stressed. I need a holiday." },
          { w: 'cold', ipa: '/kəʊld/', pos: 'adj', def: 'not warm', ex: "I'm cold. Close the window, please." }
        ],
        ex: [
          { t: 'mc', q: '___ shoes over there are nice.', o: ['This', 'These', 'Those'], a: 2 },
          { t: 'mc', q: 'I\'m ___. Can I have some water?', o: ['hungry', 'thirsty', 'tired'], a: 1 },
          { t: 'gap', q: '___ is my desk, here.', a: 'This' },
          { t: 'gap', q: "___ worry! Everything is fine. (negative imperative)", a: "Don't" },
          { t: 'order', a: "Let's go to a café." },
          { t: 'order', a: "How much are those tickets?" },
          { t: 'transform', instr: 'Make it plural.', q: 'this key', a: ['these keys'] },
          { t: 'transform', instr: 'Make it a negative imperative.', q: 'Open the window.', a: ["Don't open the window."] },
          { t: 'match', pairs: [['hungry', 'you want to eat'], ['thirsty', 'you want to drink'], ['tired', 'you need to sleep'], ['bored', 'nothing is interesting']] },
          { t: 'dictation', a: "I'm tired and I'm really hungry." },
          { t: 'listen', text: "I'm not hungry, but I'm very thirsty. Let's find a café.", q: 'How does she feel?', o: ['hungry', 'thirsty', 'bored'], a: 1 }
        ],
        speak: [
          { p: 'Say how you feel today and why.', model: "I'm a bit tired because I worked late." },
          { p: 'Give your partner five classroom instructions.', model: "Stand up. Close the door. Don't look at your phone." },
          { p: 'Compare two things in the room with this / that.', model: 'This chair is comfortable, but that one is better.' }
        ]
      }
    ],
    test: [
      { t: 'mc', q: '___ are my glasses.', o: ['This', 'These', 'That'], a: 1 },
      { t: 'mc', q: 'It is ___ old watch.', o: ['a', 'an', '—'], a: 1 },
      { t: 'gap', q: 'There are two ___ (woman) in the office.', a: 'women' },
      { t: 'gap', q: "___ worry, we aren't late.", a: "Don't" },
      { t: 'order', a: "Those jeans are very expensive." },
      { t: 'transform', instr: 'Write the opposite adjective.', q: 'big', a: ['small', 'little'] },
      { t: 'match', pairs: [['angry', 'you feel bad about something'], ['worried', 'you think something bad can happen'], ['stressed', 'you have too much to do'], ['happy', 'you feel good']] },
      { t: 'dictation', a: "These headphones are quite cheap." }
    ]
  });

  /* ===================== UNITS 3–12 — SYLLABUS FRAME ===================== */
  const frame = [
    { n: 3, title: 'Work and study', theme: 'Jobs, verb phrases, telling the time', accent: 'amber',
      practical: 'Practical English — ordering in a coffee shop',
      lessons: [
        { id: '3A', title: 'What do you do?', g: 'present simple + and −', v: 'Common verb phrases' },
        { id: '3B', title: 'Jobs', g: 'word order in questions', v: 'Jobs' },
        { id: '3C', title: "What's the time?", g: 'question words', v: 'Telling the time' }
      ] },
    { n: 4, title: 'Every day', theme: 'Family & daily routine', accent: 'mint',
      practical: 'Practical English — small talk about your day',
      lessons: [
        { id: '4A', title: 'My family', g: 'present simple — third person', v: 'The family' },
        { id: '4B', title: 'A normal day', g: 'adverbs of frequency', v: 'Daily routine' },
        { id: '4C', title: 'When and where', g: 'prepositions of time & place', v: 'Time expressions' }
      ] },
    { n: 5, title: 'Can you?', theme: 'Ability, likes, weather & clothes', accent: 'pink',
      practical: 'Practical English — buying clothes in a shop',
      lessons: [
        { id: '5A', title: 'Skills', g: "can / can't", v: 'More verb phrases' },
        { id: '5B', title: 'Likes and dislikes', g: 'like + verb + -ing', v: 'The weather & seasons' },
        { id: '5C', title: 'What are you wearing?', g: 'object pronouns', v: 'Clothes' }
      ] },
    { n: 6, title: 'Back then', theme: 'The past: dates and events', accent: 'teal',
      practical: 'Practical English — apologizing and explaining',
      lessons: [
        { id: '6A', title: 'Where were you?', g: 'past simple of be — was / were', v: 'The date & ordinals' },
        { id: '6B', title: 'Yesterday', g: 'past simple — regular verbs', v: 'Past time expressions' },
        { id: '6C', title: 'A good story', g: 'past simple — irregular verbs', v: 'Verbs for stories' }
      ] },
    { n: 7, title: 'Home', theme: 'Houses, rooms and places', accent: 'amber',
      practical: 'Practical English — renting a flat',
      lessons: [
        { id: '7A', title: 'My place', g: 'there is / there are', v: 'The house & rooms' },
        { id: '7B', title: 'Where is it?', g: 'prepositions of place', v: 'Furniture' },
        { id: '7C', title: 'It was different', g: 'there was / there were', v: 'Describing places' }
      ] },
    { n: 8, title: 'Food and drink', theme: 'Meals, quantity, eating out', accent: 'mint',
      practical: 'Practical English — in a restaurant',
      lessons: [
        { id: '8A', title: 'In the kitchen', g: 'countable & uncountable nouns', v: 'Food' },
        { id: '8B', title: 'How much?', g: 'how much / how many; quantifiers', v: 'Containers & quantity' },
        { id: '8C', title: 'Eating out', g: 'would like vs like', v: 'Restaurant language' }
      ] },
    { n: 9, title: 'Comparing', theme: 'Places, transport, opinions', accent: 'pink',
      practical: 'Practical English — asking for travel information',
      lessons: [
        { id: '9A', title: 'Better or worse?', g: 'comparative adjectives', v: 'Transport' },
        { id: '9B', title: 'The best in town', g: 'superlative adjectives', v: 'City places' },
        { id: '9C', title: 'Making plans', g: 'would like + infinitive', v: 'Offers & invitations' }
      ] },
    { n: 10, title: 'Plans', theme: 'The future and intentions', accent: 'teal',
      practical: 'Practical English — at the airport',
      lessons: [
        { id: '10A', title: 'Next weekend', g: 'be going to — plans', v: 'Holiday activities' },
        { id: '10B', title: 'Why?', g: 'infinitive of purpose', v: 'Reasons & goals' },
        { id: '10C', title: 'How well?', g: 'adverbs of manner', v: 'Adverbs' }
      ] },
    { n: 11, title: 'Right now', theme: 'Actions in progress & obligation', accent: 'amber',
      practical: 'Practical English — a phone call',
      lessons: [
        { id: '11A', title: "What's happening?", g: 'present continuous', v: 'Actions & verbs' },
        { id: '11B', title: 'Usually or now?', g: 'present simple vs present continuous', v: 'Describing photos' },
        { id: '11C', title: 'Rules', g: "have to / don't have to", v: 'Rules & obligations' }
      ] },
    { n: 12, title: 'Experience', theme: 'Life experience and review', accent: 'mint',
      practical: 'Practical English — a job interview, simple version',
      lessons: [
        { id: '12A', title: 'Have you ever?', g: 'present perfect — experience', v: 'Life events' },
        { id: '12B', title: 'When did you?', g: 'present perfect vs past simple', v: 'Time markers' },
        { id: '12C', title: 'Elementary review', g: 'all tenses A1–A2', v: 'Consolidation' }
      ] }
  ];
  frame.forEach(u => { u.lessons.forEach(l => { l.locked = true; }); u.locked = true; U.push(u); });

  window.EF_COURSES = window.EF_COURSES || {};
  window.EF_COURSES.elementary = {
    id: 'elementary', name: 'Elementary', cefr: 'A1–A2',
    note: 'Unit and lesson order follows the English File 4e Elementary syllabus; all texts and exercises are original.',
    units: U
  };
})();
