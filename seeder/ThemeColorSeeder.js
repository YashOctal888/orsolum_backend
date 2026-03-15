import ThemeColor from "../models/ThemeColor.js";

const ThemeColorSeeder = async () => {
    try {
        const colors = [
            {
                name: "Emerald Garden",
                primary_color: "#1F6728",
                secondary_color: "#E8F5E9",
                accent_color: "#123F18",
                bg_color: "#F1F8F4",
                side_color: "#E3EFE8",
                fg_color: "#2B4B3F",
                active: true
            },
            {
                name: "Ocean Breeze",
                primary_color: "#2563EB",
                secondary_color: "#E0F2FE",
                accent_color: "#1D4ED8",
                bg_color: "#F0F9FF",
                side_color: "#DAF0FF",
                fg_color: "#1E293B",
                active: false
            },
            {
                name: "Sunset Coral",
                primary_color: "#EA580C",
                secondary_color: "#FFEDD5",
                accent_color: "#C2410C",
                bg_color: "#FFF7ED",
                side_color: "#FEE8D1",
                fg_color: "#431407",
                active: false
            },
            {
                name: "Lavender Dream",
                primary_color: "#7C3AED",
                secondary_color: "#F5F3FF",
                accent_color: "#6D28D9",
                bg_color: "#FBFBFF",
                side_color: "#EDE9FE",
                fg_color: "#2E1065",
                active: false
            },
            {
                name: "Slate Modern",
                primary_color: "#475569",
                secondary_color: "#F8FAFC",
                accent_color: "#334155",
                bg_color: "#F1F5F9",
                side_color: "#CBD5E1",
                fg_color: "#1E293B",
                active: false
            },
            {
                name: "Rose Petal",
                primary_color: "#DB2777",
                secondary_color: "#FDF2F8",
                accent_color: "#BE185D",
                bg_color: "#FFF1F2",
                side_color: "#FCE7F3",
                fg_color: "#500724",
                active: false
            },
            {
                name: "Amber Glow",
                primary_color: "#D97706",
                secondary_color: "#FEF3C7",
                accent_color: "#B45309",
                bg_color: "#FFFBEB",
                side_color: "#FDE68A",
                fg_color: "#451A03",
                active: false

            },
            {
                name: "Crimson Pro",
                primary_color: "#DC2626",
                secondary_color: "#FEE2E2",
                accent_color: "#B91C1C",
                bg_color: "#FFF5F5",
                side_color: "#FECACA",
                fg_color: "#3F0A0A",
                active: false
            },
            {
                name: "Teal Fresh",
                primary_color: "#0D9488",
                secondary_color: "#F0FDFA",
                accent_color: "#0F766E",
                bg_color: "#F5FFFE",
                side_color: "#CCFBF1",
                fg_color: "#134E4A",
                active: false
            },
        ];

        await ThemeColor.deleteMany({});

        await ThemeColor.insertMany(colors)

        console.log("✅ ThemeColorSeeder seeder run successfully");
    } catch (error) {
        console.error('❌ Error in seeding Theme Color:', error);
        throw error;
    }
}

export default ThemeColorSeeder