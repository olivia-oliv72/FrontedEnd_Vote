export const roleUsers = [
    {
        id: 1,
        username: "admin",
        password: "admin123",
        role: "admin",
    },
    {
        id: 2,
        username: "user1",
        password: "user123",
        email: "user@gmail.com",
        role: "user",
    }
];

export const initialCategories = [
    {
        id: "female",
        name: "Best Female Artist",
        candidates: [
            { id: "f1", name: "IU", photo: "iu.png" },
            { id: "f2", name: "Taeyeon", photo: "taeyeon.png" },
            { id: "f3", name: "Jennie Kim", photo: "jennie.png" },
            { id: "f4", name: "Nayeon", photo: "nayeon.png" },
            { id: "f5", name: "Jisoo", photo: "jisoo.png" },
            { id: "f6", name: "Sabrina Carpenter", photo: "sabrina.png" },
            { id: "f7", name: "SZA", photo: "sza.png" },
            { id: "f8", name: "Taylor Swift", photo: "taylor.png" },
            { id: "f9", name: "Ariana Grande", photo: "ariana.png" },
            { id: "f10", name: "Tyla", photo: "tyla.png" },
        ],
    },
    {
        id: "male",
        name: "Best Male Artist",
        candidates: [
            { id: "m1", name: "Jungkook", photo: "jungkook.png" },
            { id: "m2", name: "Jimin", photo: "jimin.png" },
            { id: "m3", name: "Lim Young-woong", photo: "youngwoong.png" },
            { id: "m4", name: "Baekhyun", photo: "baekhyun.png" },
            { id: "m5", name: "Taemin", photo: "taemin.png" },
            { id: "m6", name: "Eminem", photo: "eminem.png" },
            { id: "m7", name: "Kendrick Lamar", photo: "kendrick.png" },
            { id: "m8", name: "Bruno Mars", photo: "bruno.png" },
            { id: "m9", name: "The Weeknd", photo: "theweeknd.png" },
            { id: "m10", name: "Ed Sheeran", photo: "edsheeran.png" },
        ],
    },
    {
        id: "collab",
        name: "Best Collaboration",
        candidates: [
            { id: "c1", name: "Zico ft. Jennie", photo: "zico-jennie.png" },
            { id: "c2", name: "Lisa ft. Rosalía", photo: "lisa-rosalia.png" },
            { id: "c3", name: "Jungkook ft. Latto", photo: "jk-latto.png" },
            { id: "c4", name: "BSS ft. Lee Young-ji", photo: "bss-youngji.png" },
            { id: "c5", name: "Psy ft. SUGA", photo: "psy.png" },
            { id: "c6", name: "Bruno Mars & Lady Gaga", photo: "ladyGaga-bruno.png" },
            { id: "c7", name: "Taylor Swift ft. Post Malone", photo: "taylor-postmalone.png" },
            { id: "c8", name: "Charli XCX ft. Ariana Grande", photo: "charli-ariana.png" },
            { id: "c9", name: "ROSÉ & Bruno Mars", photo: "rose-bruno.png" },
            { id: "c10", name: "The Weeknd ft. Playboi Carti", photo: "theweeknd-playboi.png" },
        ],
    },
];

export const history = [
    {
        email: "user@gmail.com",
        vote: [
            { category: "Best Female", name: "IU", photo: "iu.png" },
            { category: "Best Male", name: "TXT", photo: "iu.png" },
            { category: "Best Collaboration", name: "Zico", photo: "iu.png" },
        ]
    }
];