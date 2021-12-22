import {PointsDto} from "../../model/Dto/PointsDto";

export function getUniqueArray(results: PointsDto[]) {
    return results.filter((result, index) => {
        const _result = JSON.stringify(result);
        return index === results.findIndex(obj => {
            return JSON.stringify(obj) === _result;
        });
    });
}
