import { Button } from "@/components/ui/button";

const DownloadCSVButton = ({ data , name="data"}) => {
    const handleDownload = () => {
        // Convert JSON to CSV
        const headers = Object.keys(data[0]);
        const csvRows = [headers.join(",")];

        for (const row of data) {
            const values = headers.map((h) =>
                JSON.stringify(row[h] ?? "")
            );
            csvRows.push(values.join(","));
        }

        const csvString = csvRows.join("\n");
        const blob = new Blob([csvString], { type: "text/csv" });
        const url = URL.createObjectURL(blob);

        const a = document.createElement("a");
        a.href = url;
        a.download = `${name}.csv`;
        a.click();
        URL.revokeObjectURL(url);
    };

    return <Button onClick={handleDownload}>Download CSV</Button>;
};

export default DownloadCSVButton;
