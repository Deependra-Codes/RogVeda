export type RoomType = "General Ward" | "Semi-Private" | "Private" | "Suite";
export type BookingStatus = "Confirmed" | "In Progress" | "Completed";
export type BookingTaskStatus = "Pending" | "Complete";
export type WalletTransactionKind = "booking_debit" | "manual_credit";

export type CreateBookingTransactionResult = {
  booking_id: string;
  booking_status: BookingStatus;
  wallet_balance_usd_cents: number;
  amount_usd_cents: number;
  patient_id: string;
  task_id: string;
};

export type CompleteBookingTaskResult = {
  task_id: string;
  task_status: BookingTaskStatus;
  booking_id: string;
  booking_status: BookingStatus;
};

type TableDefinition<Row, Insert, Update> = {
  Row: Row;
  Insert: Insert;
  Update: Update;
};

export interface Database {
  public: {
    Tables: {
      vendors: TableDefinition<
        {
          id: string;
          username: string;
          password: string;
          display_name: string;
          created_at: string;
        },
        {
          id?: string;
          username: string;
          password: string;
          display_name: string;
          created_at?: string;
        },
        Partial<{
          username: string;
          password: string;
          display_name: string;
        }>
      >;
      hospitals: TableDefinition<
        {
          id: string;
          vendor_id: string;
          name: string;
          city: string;
          region_label: string;
          procedure_name: string;
          summary: string;
          image_token: string;
          trust_signal_one: string;
          trust_signal_two: string;
          trust_signal_three: string;
          created_at: string;
        },
        {
          id?: string;
          vendor_id: string;
          name: string;
          city: string;
          region_label: string;
          procedure_name: string;
          summary: string;
          image_token: string;
          trust_signal_one: string;
          trust_signal_two: string;
          trust_signal_three: string;
          created_at?: string;
        },
        Partial<{
          vendor_id: string;
          name: string;
          city: string;
          region_label: string;
          procedure_name: string;
          summary: string;
          image_token: string;
          trust_signal_one: string;
          trust_signal_two: string;
          trust_signal_three: string;
        }>
      >;
      doctors: TableDefinition<
        {
          id: string;
          hospital_id: string;
          name: string;
          years_experience: number;
          created_at: string;
        },
        {
          id?: string;
          hospital_id: string;
          name: string;
          years_experience: number;
          created_at?: string;
        },
        Partial<{
          hospital_id: string;
          name: string;
          years_experience: number;
        }>
      >;
      pricing: TableDefinition<
        {
          id: string;
          hospital_id: string;
          doctor_id: string;
          room_type: RoomType;
          amount_usd_cents: number;
          created_at: string;
        },
        {
          id?: string;
          hospital_id: string;
          doctor_id: string;
          room_type: RoomType;
          amount_usd_cents: number;
          created_at?: string;
        },
        Partial<{
          hospital_id: string;
          doctor_id: string;
          room_type: RoomType;
          amount_usd_cents: number;
        }>
      >;
      patients: TableDefinition<
        {
          id: string;
          full_name: string;
          email: string;
          wallet_balance_usd_cents: number;
          created_at: string;
        },
        {
          id?: string;
          full_name: string;
          email: string;
          wallet_balance_usd_cents?: number;
          created_at?: string;
        },
        Partial<{
          full_name: string;
          email: string;
          wallet_balance_usd_cents: number;
        }>
      >;
      bookings: TableDefinition<
        {
          id: string;
          patient_id: string;
          vendor_id: string;
          hospital_id: string;
          doctor_id: string;
          procedure_name: string;
          room_type: RoomType;
          amount_usd_cents: number;
          status: BookingStatus;
          created_at: string;
        },
        {
          id?: string;
          patient_id: string;
          vendor_id: string;
          hospital_id: string;
          doctor_id: string;
          procedure_name: string;
          room_type: RoomType;
          amount_usd_cents: number;
          status?: BookingStatus;
          created_at?: string;
        },
        Partial<{
          patient_id: string;
          vendor_id: string;
          hospital_id: string;
          doctor_id: string;
          procedure_name: string;
          room_type: RoomType;
          amount_usd_cents: number;
          status: BookingStatus;
        }>
      >;
      wallet_transactions: TableDefinition<
        {
          id: string;
          patient_id: string;
          booking_id: string | null;
          kind: WalletTransactionKind;
          amount_usd_cents: number;
          balance_after_usd_cents: number;
          note: string | null;
          created_at: string;
        },
        {
          id?: string;
          patient_id: string;
          booking_id?: string | null;
          kind?: WalletTransactionKind;
          amount_usd_cents: number;
          balance_after_usd_cents: number;
          note?: string | null;
          created_at?: string;
        },
        Partial<{
          patient_id: string;
          booking_id: string | null;
          kind: WalletTransactionKind;
          amount_usd_cents: number;
          balance_after_usd_cents: number;
          note: string | null;
        }>
      >;
      booking_tasks: TableDefinition<
        {
          id: string;
          booking_id: string;
          vendor_id: string;
          title: string;
          status: BookingTaskStatus;
          completed_at: string | null;
          created_at: string;
        },
        {
          id?: string;
          booking_id: string;
          vendor_id: string;
          title: string;
          status?: BookingTaskStatus;
          completed_at?: string | null;
          created_at?: string;
        },
        Partial<{
          booking_id: string;
          vendor_id: string;
          title: string;
          status: BookingTaskStatus;
          completed_at: string | null;
        }>
      >;
    };
    Enums: {
      room_type: RoomType;
      booking_status: BookingStatus;
      booking_task_status: BookingTaskStatus;
      wallet_transaction_kind: WalletTransactionKind;
    };
    Views: Record<string, never>;
    Functions: {
      complete_booking_task: {
        Args: {
          input_task_id: string;
          input_vendor_id: string;
        };
        Returns: CompleteBookingTaskResult[];
      };
      create_booking_transaction: {
        Args: {
          input_hospital_id: string;
          input_doctor_id: string;
          input_room_type: RoomType;
          input_patient_name: string;
          input_patient_email: string;
        };
        Returns: CreateBookingTransactionResult[];
      };
    };
    CompositeTypes: Record<string, never>;
  };
}
