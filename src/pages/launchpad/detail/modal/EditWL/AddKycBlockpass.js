import React, { useCallback, useEffect, useState } from "react";

import {
  useReactTable,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  flexRender,
} from "@tanstack/react-table";
import {
  Box,
  Button,
  Flex,
  Input,
  Select,
  Table,
  TableContainer,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
} from "@chakra-ui/react";
import { addressShortener } from "utils";
import { APICall } from "api/client";

const useSkipper = () => {
  const shouldSkipRef = React.useRef(true);
  const shouldSkip = shouldSkipRef.current;

  // Wrap a function with this to skip a pagination reset temporarily
  const skip = React.useCallback(() => {
    shouldSkipRef.current = false;
  }, []);

  React.useEffect(() => {
    shouldSkipRef.current = true;
  });

  return [shouldSkip, skip];
};

export default function AddKycBlockpass({ launchpadData, selectedPhase }) {
  const [kycAddress, setKycAddress] = useState([]);

  const fetchPhaseData = useCallback(async () => {
    const { ret, status } = await APICall.getKycAddress({
      where: {
        clientId: launchpadData?.launchpadContract,
      },
    });
    if (status === "OK") {
      const whitelist = launchpadData?.phaseList[selectedPhase]["whitelist"];
      const whitelistAddress = whitelist.map((i) => i.account);

      const retWithCheck = ret.map((item) => {
        const ret = {
          ...item,
          price: 0,
          amount: 0,
          isAddWhitelist: "NO",
        };

        const indexFound = whitelistAddress.indexOf(item.refId);

        if (indexFound >= 0) {
          const price = whitelist[indexFound].price.replaceAll(",", "");
          const amount = whitelist[indexFound].amount.replaceAll(",", "");

          // TODO: checking dynamic decimal ?
          ret.price = price / 10 ** 12;
          ret.amount = amount / 10 ** 12;
          ret.isAddWhitelist = "YES";
        }

        return ret;
      });
      setKycAddress(retWithCheck);
    }
  }, [
    launchpadData?.launchpadContract,
    launchpadData?.phaseList,
    selectedPhase,
  ]);

  useEffect(() => {
    fetchPhaseData();
  }, [fetchPhaseData]);

  const defaultColumn = {
    cell: ({ getValue, row: { index }, column: { id }, table }) => {
      const initialValue = getValue();
      // We need to keep and update the state of the cell normally
      // eslint-disable-next-line react-hooks/rules-of-hooks
      const [value, setValue] = React.useState(initialValue);

      // When the input is blurred, we'll call our table meta's updateData function
      const onBlur = () => {
        table.options.meta?.updateData(index, id, value);
      };

      // If the initialValue is changed external, sync it up with our state
      // eslint-disable-next-line react-hooks/rules-of-hooks
      React.useEffect(() => {
        setValue(initialValue);
      }, [initialValue]);

      return (
        <input
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onBlur={onBlur}
        />
      );
    },
  };

  const columns = React.useMemo(
    () => [
      {
        accessorKey: "refId",
        header: () => <span>KYC Address</span>,
        footer: (props) => props.column.id,
        cell: (info) => addressShortener(info.getValue()),
      },
      {
        accessorKey: "status",
        header: "KYC Status",
        footer: (props) => props.column.id,
        cell: (info) => info.getValue().toUpperCase(),
      },
      {
        accessorKey: "isAddWhitelist",
        header: "On Whitelist",
        footer: (props) => props.column.id,
        cell: (info) => info.getValue().toUpperCase(),
      },
      {
        accessorKey: "amount",
        header: "Amount",
        footer: (props) => props.column.id,
      },
      {
        accessorKey: "price",
        header: "Price",
        footer: (props) => props.column.id,
      },
      {
        id: "select",
        header: ({ table, ...rest }) => {
          const modifiedOnChange = (e) => {
            console.log("row.original. e", e.currentTarget.checked);
            table
              .getColumn("select")
              .getFacetedRowModel()
              .rows?.forEach((row) => {
                if (
                  row.original.isAddWhitelist === "NO" &&
                  row.original.status === "approved"
                ) {
                  row.toggleSelected(e.currentTarget.checked);
                }
              });
          };

          let selectableRowsInCurrentPage = 0;
          let selectedRowsInCurrentPage = 0;
          table
            .getColumn("select")
            .getFacetedRowModel()
            .rows?.forEach((row) => {
              row.getIsSelected() && selectedRowsInCurrentPage++;
              if (
                row.original.isAddWhitelist === "NO" &&
                row.original.status === "approved"
              ) {
                selectableRowsInCurrentPage++;
              }
            });

          const disabled = selectableRowsInCurrentPage === 0;
          const manualChecked =
            selectableRowsInCurrentPage === selectedRowsInCurrentPage &&
            !disabled;

          return (
            <Flex
              flexDirection="column"
              alignItems="center"
              className=""
              mx={4}
            >
              <Text mb="10px">Select</Text>

              <IndeterminateCheckbox
                {...{
                  disabled: disabled,
                  checked: manualChecked || table.getIsAllPageRowsSelected(),
                  indeterminate: table.getIsSomeRowsSelected(),
                  onChange: (e) => modifiedOnChange(e),
                }}
              />
            </Flex>
          );
        },
        cell: ({ row }) => (
          <Flex className="" mx={4} justify="center">
            {console.log("row.original", row.original)}
            <IndeterminateCheckbox
              {...{
                checked: row.getIsSelected(),
                disabled:
                  !row.getCanSelect() ||
                  row.original.isAddWhitelist === "YES" ||
                  row.original.status !== "approved",
                indeterminate: row.getIsSomeSelected(),
                onChange: row.getToggleSelectedHandler(),
              }}
            />
          </Flex>
        ),
      },
    ],
    []
  );

  const [rowSelection, setRowSelection] = React.useState({});

  const [autoResetPageIndex, skipAutoResetPageIndex] = useSkipper();

  const table = useReactTable({
    data: kycAddress,
    columns,
    defaultColumn,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    autoResetPageIndex,
    enableRowSelection: true,
    onRowSelectionChange: setRowSelection,
    meta: {
      updateData: (rowIndex, columnId, value) => {
        // Skip page index reset until after next rerender
        skipAutoResetPageIndex();
        setKycAddress((old) =>
          old.map((row, index) => {
            if (index === rowIndex) {
              return {
                ...old[rowIndex],
                [columnId]: value,
              };
            }
            return row;
          })
        );
      },
    },
    state: {
      rowSelection,
    },
  });

  return (
    <Box sx={{ p: "2px", w: "full" }}>
      <TableContainer
        width="full"
        sx={{
          my: "18px",
          border: "1px solid #E3DFF3",
          borderRadius: 8,
        }}
      >
        <Table variant="simple" fontSize="15px">
          <Thead>
            {table.getHeaderGroups().map((headerGroup) => (
              <Tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <Th
                      // style={{
                      //   border: "1px solid black",
                      //   fontSize: "15px",
                      // }}
                      key={header.id}
                      colSpan={header.colSpan}
                    >
                      {header.isPlaceholder ? null : (
                        <Flex
                          flexDirection="column"
                          alignItems="center"
                          px="4px"
                        >
                          {flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                          {header.column.getCanFilter() ? (
                            <Filter column={header.column} table={table} />
                          ) : null}
                        </Flex>
                      )}
                    </Th>
                  );
                })}
              </Tr>
            ))}
          </Thead>
          <Tbody>
            {table.getRowModel().rows.map((row) => {
              return (
                <Tr key={row.id}>
                  {row.getVisibleCells().map((cell) => {
                    return (
                      <Td py="8px" key={cell.id}>
                        <Flex
                          h="20px"
                          flexDirection="column"
                          alignItems="center"
                          px="4px"
                          sx={{
                            "& input": {
                              width: "90px",
                              height: "30px",
                              padding: "4px",
                            },
                          }}
                        >
                          {flexRender(
                            cell.column.columnDef.cell,
                            cell.getContext()
                          )}
                        </Flex>
                      </Td>
                    );
                  })}
                </Tr>
              );
            })}
          </Tbody>
        </Table>
      </TableContainer>

      <Flex justify="space-between" alignItems="center" my="10px">
        <Flex alignItem my="10px" h="30px">
          <Button
            px="4px"
            mx="4px"
            size="sx"
            w="30px"
            className="border rounded p-1"
            onClick={() => table.setPageIndex(0)}
            disabled={!table.getCanPreviousPage()}
          >
            {"<<"}
          </Button>
          <Button
            px="4px"
            mx="4px"
            size="sx"
            w="30px"
            className="border rounded p-1"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            {"<"}
          </Button>
          <Button
            px="4px"
            mx="4px"
            size="sx"
            w="30px"
            className="border rounded p-1"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            {">"}
          </Button>
          <Button
            px="4px"
            mx="4px"
            size="sx"
            w="30px"
            className="border rounded p-1"
            onClick={() => table.setPageIndex(table.getPageCount() - 1)}
            disabled={!table.getCanNextPage()}
          >
            {">>"}
          </Button>
        </Flex>
        <Flex alignItems="center" mx="24px" h="30px">
          <Text>Page: </Text>
          <strong>
            {" "}
            {table.getState().pagination.pageIndex + 1} of{" "}
            {table.getPageCount()}
          </strong>
        </Flex>
        <Flex mx="24px" className="flex items-center gap-1">
          | Go to page:
          <Input
            h="30px"
            maxW="50px"
            type="number"
            defaultValue={table.getState().pagination.pageIndex + 1}
            onChange={(e) => {
              const page = e.target.value ? Number(e.target.value) - 1 : 0;
              table.setPageIndex(page);
            }}
            className="border p-1 rounded w-16"
          />
        </Flex>
        <Select
          h="30px"
          maxW="220px"
          value={table.getState().pagination.pageSize}
          onChange={(e) => {
            table.setPageSize(Number(e.target.value));
          }}
        >
          {[10, 20, 30, 40, 50].map((pageSize) => (
            <option key={pageSize} value={pageSize}>
              Show {pageSize} per page
            </option>
          ))}
        </Select>
        <Flex mx="24px">
          {Object.keys(rowSelection).length} of{" "}
          {table.getPreFilteredRowModel().rows.length} Total Rows Selected
        </Flex>
      </Flex>
      {/* {console.log("table", table)}
      {console.log(
        "table.getSelectedRowModel().flatRows",
        table.getSelectedRowModel().flatRows[0]?.original
      )}
      {console.log("table data", table?.options?.data)}{" "} */}
      {/* <div>{table.getRowModel().rows.length} Rows</div> */}
    </Box>
  );
}

function Filter({ column, table }) {
  const firstValue = table
    .getPreFilteredRowModel()
    .flatRows[0]?.getValue(column.id);

  const columnFilterValue = column.getFilterValue();

  return typeof firstValue === "number" ? (
    <Flex justify="space-evenly" className="flex space-x-2">
      <Input
        mx="2px"
        px="2px"
        h="30px"
        maxW="100px"
        type="number"
        value={columnFilterValue?.[0] ?? ""}
        onChange={(e) =>
          column.setFilterValue((old) => [e.target.value, old?.[1]])
        }
        placeholder={`Min`}
        className="w-24 border shadow rounded"
      />
      <Input
        px="2px"
        mx="2px"
        h="30px"
        maxW="100px"
        type="number"
        value={columnFilterValue?.[1] ?? ""}
        onChange={(e) =>
          column.setFilterValue((old) => [old?.[0], e.target.value])
        }
        placeholder={`Max`}
        className="w-24 border shadow rounded"
      />
    </Flex>
  ) : (
    <Input
      p="2px"
      h="30px"
      type="text"
      value={columnFilterValue ?? ""}
      onChange={(e) => column.setFilterValue(e.target.value)}
      placeholder={`Search...`}
      className="w-36 border shadow rounded"
    />
  );
}

function IndeterminateCheckbox({ indeterminate, ...rest }) {
  const ref = React.useRef(null);

  React.useEffect(() => {
    if (typeof indeterminate === "boolean") {
      ref.current.indeterminate = !rest.checked && indeterminate;
    }
  }, [ref, indeterminate, rest.checked]);

  return (
    <input
      ref={ref}
      disabled={false}
      type="checkbox"
      className={" cursor-pointer"}
      style={{ width: "20px", height: "20px" }}
      {...rest}
    />
  );
}
