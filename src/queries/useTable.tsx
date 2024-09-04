import tableApiRequest from "@/apiRequest/table";
import {
  CreateTableBodyType,
  UpdateTableBodyType,
} from "@/schemaValidations/table.schema";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export const useTableList = () => {
  {
    return useQuery({
      queryKey: ["tables"],
      queryFn: tableApiRequest.getTableList,
    });
  }
};
export const useCreateTable = () => {
  const queryClient = useQueryClient();
  {
    return useMutation({
      mutationFn: (body: CreateTableBodyType) =>
        tableApiRequest.createTable(body),
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: ["tables"],
        });
      },
    });
  }
};
export const useTableDetail = ({
  number,
  enabled,
}: {
  number: number;
  enabled: boolean;
}) => {
  {
    return useQuery({
      queryKey: ["tables", number],
      queryFn: () => tableApiRequest.getTableDetail(number),
      enabled,
    });
  }
};
export const useUpdateTable = () => {
  const queryClient = useQueryClient();
  {
    return useMutation({
      mutationFn: ({
        number,
        body,
      }: {
        body: UpdateTableBodyType;
        number: number;
      }) => tableApiRequest.updateTable({ body, number }),
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: ["tables"],
          exact: true,
        });
      },
    });
  }
};

export const useDeleteTable = () => {
  const queryClient = useQueryClient();
  {
    return useMutation({
      mutationFn: tableApiRequest.deleteTable,
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: ["tables"],
        });
      },
    });
  }
};
