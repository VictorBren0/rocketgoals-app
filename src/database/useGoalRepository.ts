import { useSQLiteContext } from "expo-sqlite/next";

export type GoalCreateDatabase = {
    name: string;
    total: number;
};

export type GoalResponseDatabase = {
    id: string;
    name: string;
    total: number;
    current: number;
};

export function useGoalRepository() {
    const db = useSQLiteContext();

    function create(goal: GoalCreateDatabase) {
        try {
            const statement = db.prepareSync(
                "INSERT INTO goals (name, total) VALUES ($name, $total)"
            );

            statement.executeSync({
                $name: goal.name,
                $total: goal.total,
            })
        } catch (error) {
            throw error;
        }
    }

    function all() {
        try {
            return db.getAllSync<GoalResponseDatabase>(`
                SELECT g.id, g.name, g.total, COALESCE(SUM(t.amount), 0) AS current
                FROM goals  AS g
                LEFT JOIN transactions t ON t.goal_id = g.id
                GROUP BY g.id, g.name, g.total;
                `)
        } catch (error) {
            throw error;
        }
    }

    function show(id: number) {
        try {
            const statement = db.prepareSync(`
                SELECT g.id, g.name, g.total, COALESCE(SUM(t.amount), 0) AS current
                FROM goals  AS g
                LEFT JOIN transactions t ON t.goal_id = g.id
                WHERE g.id = $id
                GROUP BY g.id, g.name, g.total;
            `);

            const result = statement.executeSync<GoalResponseDatabase>({ $id: id });

            return result.getFirstSync();

        } catch (error) {
            throw error;
        }
    }

    return {
        create,
        all,
        show,
    };
}