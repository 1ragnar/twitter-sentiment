import moment from "moment";

const createLineGraphData = (
    data: any,
    endDate: Date,
    startDate: Date,
    firstLabel: string,
    firstKey: string, //count
    secondLabel?: string,
    secondKey?: string //if we have 2 counts eg. firstKey = userCount, secondKey = gameCount
) => {
    let fullGraphArray: {
        labels: string[],
        datasets: {
            label: string,
            data: number[],
            fill: boolean,
            backgroundColor: string,
            borderColor: string
        }[],
    } = {
        labels: [],
        datasets: [
            {
                label: firstLabel,
                data: [],
                fill: true,
                backgroundColor: 'rgba(47, 75, 124, 0.2)',
                borderColor: 'rgba(47, 75, 124, 1)'
            },
        ],
    };

    secondLabel &&
        fullGraphArray.datasets.push({
            label: secondLabel,
            data: [],
            fill: true,
            backgroundColor: "rgba(255, 166, 0, 0.2)",
            borderColor: "rgba(255, 166, 0, 1)"
        });

    let dateObject = moment(endDate);
    const interval = moment.duration(moment(endDate).diff(moment(startDate))).asDays();
    let i = 0;
    while (i <= interval - 1) {
        dateObject.subtract(1, "days");
        fullGraphArray.labels.push(
            moment(dateObject).format("DD.MM.YYYY").substring(0, 5)
        );
        fullGraphArray.datasets[0].data.push(+data[i][firstKey]);
        secondKey &&
            fullGraphArray.datasets[1].data.push(+data[i][secondKey]);

        i++
    }
    fullGraphArray.labels.reverse();
    fullGraphArray.datasets[0].data.reverse();
    secondKey && fullGraphArray.datasets[1].data.reverse();

    return fullGraphArray;
};



export {
    createLineGraphData
}