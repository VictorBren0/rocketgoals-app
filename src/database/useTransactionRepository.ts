import { useSQLiteContext } from "expo-sqlite/next";

type TransactionCreateDatabase = {
    goalId: number;
    amount: number;
};

type TransactionResponseDatabase = {
    id: string;
    amount: number;
    goal_id: number;
    created_at: number;
};

export function useTransactionRepository() {
    const db = useSQLiteContext();

    function findLatest() {
        try {
            return db.getAllSync<TransactionResponseDatabase>(`
                SELECT * FROM transactions
                ORDER BY created_at DESC
                LIMIT 10;
            `)
        } catch (error) {
            throw error;
        }
    }

    function findByGoal(goalId: number) {
        try {
            const statement = db.prepareSync(`
                SELECT * FROM transactions
                WHERE goal_id = $goal_id
            `);

            const result = statement.executeSync<TransactionResponseDatabase>({ $goal_id: goalId });

            return result.getAllSync();
        } catch (error) {
            throw error;
        }
    }

    function create(transaction: TransactionCreateDatabase) {
        try {
            const statement = db.prepareSync(`
                INSERT INTO transactions (goal_id, amount) VALUES ($goal_id, $amount)
            `);

            statement.executeSync({
                $goal_id: transaction.goalId,
                $amount: transaction.amount,
            });
        } catch (error) {
            throw error;
        }
    }
    

    return {
        findLatest,
        findByGoal,
        create
    };
}