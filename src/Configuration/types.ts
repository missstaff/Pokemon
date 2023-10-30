import React, { ReactNode } from "react";

export interface ShowIfProps {
    condition: boolean;
    render: () => ReactNode;
    renderElse?: () => ReactNode;
  };

export interface Pokemon {
    name: string;
    id: string,
    imageUrl: string,
}