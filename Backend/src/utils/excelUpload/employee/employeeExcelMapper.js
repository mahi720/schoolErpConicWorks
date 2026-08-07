const normalizeValue = (value) => {
    if (
        value === undefined ||
        value === null ||
        value === ""
    ) {
        return null;
    }

    return String(value).trim();
};

const normalizeDate = (value) => {
    if (!value) {
        return null;
    }

    if (value instanceof Date) {
        return value.toISOString().split("T")[0];
    }

    const rawValue = String(value).trim();

    if (
        /^\d{4}-\d{2}-\d{2}$/.test(rawValue)
    ) {
        return rawValue;
    }

    const parts = rawValue.split(/[-/]/);

    if (parts.length === 3) {
        const [first, second, third] = parts;

        if (third.length === 4) {
            return `${third}-${String(second).padStart(
                2,
                "0",
            )}-${String(first).padStart(2, "0")}`;
        }
    }

    return rawValue;
};

const normalizeNatureOfAppointment = (
    value,
) => {
    if (!value) {
        return "";
    }

    const normalized = String(value)
        .trim()
        .toUpperCase()
        .replace(/[\s-]+/g, "_");

    const mapping = {
        PERMANENT: "PERMANENT",
        CONTRACTUAL: "CONTRACTUAL",
        CONTRACT: "CONTRACTUAL",
        ADHOC: "ADHOC",
        AD_HOC: "ADHOC",
        TEMPORARY: "TEMPORARY",
        PART_TIME: "PART_TIME",
        PARTTIME: "PART_TIME",
        PROBATION: "PROBATION",
        GUEST_FACULTY: "GUEST_FACULTY",
        DAILY_WAGES: "DAILY_WAGES",
        DAILY_WAGE: "DAILY_WAGES",
    };

    return mapping[normalized] || normalized;
};

const normalizeBoolean = (value) => {
    if (
        value === true ||
        value === 1
    ) {
        return true;
    }

    const normalized = String(
        value || "",
    )
        .trim()
        .toLowerCase();

    return [
        "yes",
        "true",
        "1",
        "y",
    ].includes(normalized);
};

export const mapEmployeeExcelRow = (
    row,
) => {
    return {
        fullName:
            normalizeValue(
                row["Full Name"],
            ) || "",

        nickName: null,

        employeeCode:
            normalizeValue(
                row["Employee Code"],
            ),

        phoneNumber:
            normalizeValue(
                row["Phone Number"],
            ) || "",

        email:
            normalizeValue(
                row["Email"],
            ) || "",

        dateOfBirth:
            normalizeDate(
                row["Date of Birth"],
            ) || "",

        state:
            normalizeValue(
                row["State"],
            ),

        city:
            normalizeValue(
                row["City"],
            ),

        district:
            normalizeValue(
                row["District"],
            ),

        pincode:
            normalizeValue(
                row["Pincode"],
            ),

        address:
            normalizeValue(
                row["Address"],
            ),

        qualification:
            normalizeValue(
                row["Qualification"],
            ) || "",

        department:
            normalizeValue(
                row["Department"],
            ) || "",

        designation:
            normalizeValue(
                row["Designation"],
            ) || "",

        natureOfAppointment:
            normalizeNatureOfAppointment(
                row[
                "Nature of Appointment"
                ],
            ),

        joiningDate:
            normalizeDate(
                row["Joining Date"],
            ) || "",

        payBand:
            normalizeValue(
                row["Pay Band"],
            ) || "",

        bankName:
            normalizeValue(
                row["Bank Name"],
            ),

        bankAccountNumber:
            normalizeValue(
                row[
                "Bank Account Number"
                ],
            ),

        ifscCode:
            normalizeValue(
                row["IFSC Code"],
            )?.toUpperCase() || null,

        panNumber:
            normalizeValue(
                row["PAN Number"],
            )?.toUpperCase() || null,

        uanNumber:
            normalizeValue(
                row["UAN Number"],
            ),

        aadharNumber:
            normalizeValue(
                row["Aadhar Number"],
            ),

        jobRoleDescription:
            normalizeValue(
                row[
                "Job Role Description"
                ],
            ) || "",

        isDrfApplicable:
            normalizeBoolean(
                row["DRF"],
            ),

        createLogin: false,

        loginStatus: "DEFAULT",
    };
};