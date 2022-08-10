import { Problem } from "@/services/definitions/errors";

export function useErrors() {
    function makeErrorString(problem: Problem): string {
        let error: string = "";

        Object.keys(problem.errors).forEach(err => {
            error += err + ": " + problem.errors[ err ].join('. ') + '\n';
        })
        return error;
    }

    return {
        makeErrorString
    }
}