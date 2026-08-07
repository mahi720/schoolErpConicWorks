import XLSX from "xlsx";

import {
    createEmployeeService,
} from "./employee.service.js";

import {
    createEmployeeSchema,
} from "../../../validations/HRM/employee/employee.validation.js";

import {
    mapEmployeeExcelRow,
} from "../../../utils/excelUpload/employee/employeeExcelMapper.js";

const formatZodErrors = (error) => {
    return error.issues
        .map((issue) => {
            const field =
                issue.path?.join(".") ||
                "field";

            return `${field}: ${issue.message}`;
        })
        .join(", ");
};

export const importEmployeesService = async ({
    schoolSlug,
    schoolCode,
    fileBuffer,
}) => {
    if (!fileBuffer) {
        throw new Error(
            "Excel file is required",
        );
    }

    const workbook =
        XLSX.read(fileBuffer, {
            type: "buffer",
            cellDates: true,
        });

    const firstSheetName =
        workbook.SheetNames[0];

    if (!firstSheetName) {
        throw new Error(
            "Excel file does not contain any sheet",
        );
    }

    const worksheet =
        workbook.Sheets[
        firstSheetName
        ];

    const rows =
        XLSX.utils.sheet_to_json(
            worksheet,
            {
                defval: "",
                raw: false,
            },
        );

    if (!rows.length) {
        throw new Error(
            "Excel sheet is empty",
        );
    }

    const results = [];

    let successCount = 0;
    let failedCount = 0;

    for (
        let index = 0;
        index < rows.length;
        index += 1
    ) {
        const excelRowNumber =
            index + 2;

        try {
            const payload =
                mapEmployeeExcelRow(
                    rows[index],
                );

            const validation =
                createEmployeeSchema.safeParse(
                    payload,
                );

            if (!validation.success) {
                failedCount += 1;

                results.push({
                    row: excelRowNumber,
                    success: false,
                    employeeCode:
                        payload.employeeCode,
                    fullName:
                        payload.fullName,
                    message:
                        formatZodErrors(
                            validation.error,
                        ),
                });

                continue;
            }

            const employee =
                await createEmployeeService({
                    schoolSlug,
                    schoolCode,
                    payload:
                        validation.data,
                });

            successCount += 1;

            results.push({
                row: excelRowNumber,
                success: true,
                employeeCode:
                    employee?.employeeCode ||
                    payload.employeeCode,
                employeeId:
                    employee?.employeeId ||
                    null,
                fullName:
                    employee?.fullName ||
                    payload.fullName,
                message:
                    "Employee imported successfully",
            });
        } catch (error) {
            failedCount += 1;

            results.push({
                row: excelRowNumber,
                success: false,
                employeeCode:
                    normalizeResultValue(
                        rows[index][
                        "Employee Code"
                        ],
                    ),
                fullName:
                    normalizeResultValue(
                        rows[index][
                        "Full Name"
                        ],
                    ),
                message:
                    error.message ||
                    "Failed to import employee",
            });
        }
    }

    return {
        totalRows:
            rows.length,

        successCount,

        failedCount,

        results,
    };
};

const normalizeResultValue = (
    value,
) => {
    if (
        value === undefined ||
        value === null
    ) {
        return null;
    }

    return String(value).trim() || null;
};