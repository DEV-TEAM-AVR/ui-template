import React from "react";
import { Dialog, DialogTitle, DialogContent, IconButton, Box, useTheme, useMediaQuery } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import FullscreenIcon from "@mui/icons-material/Fullscreen";
import FullscreenExitIcon from "@mui/icons-material/FullscreenExit";

interface ModalProps {
  open: boolean;
  onClose: () => void;
  title: React.ReactNode;
  /** Secondary line under the title (context: the record, date, totals…). */
  subtitle?: React.ReactNode;
  /** Keep the dialog open on backdrop click (forms where a stray click would lose input). Esc still closes. */
  disableBackdropClose?: boolean;
  children: React.ReactNode;
  maxWidth?: "xs" | "sm" | "md" | "lg" | "xl" | "2xl" | "3xl" | "4xl" | "5xl" | "6xl" | "7xl" | "full" | false;
  noPadding?: boolean;
  /** Pantalla completa (controlado). Sólo en desktop; en mobile se ignora. */
  fullScreen?: boolean;
  /** Si se pasa, muestra el botón de pantalla completa junto a la X. */
  onToggleFullScreen?: () => void;
  /** Controles en la misma fila del título (a su derecha, antes de la X). */
  headerActions?: React.ReactNode;
}

const getMuiMaxWidth = (size: ModalProps['maxWidth']): "xs" | "sm" | "md" | "lg" | "xl" | false => {
  if (size === false) return false;
  if (size && ["xs", "sm", "md", "lg", "xl"].includes(size)) return size as any;
  return "xl"; // For 2xl-7xl, we use 'xl' as base and then sx for width
};

const getWidthSx = (size: ModalProps['maxWidth']) => {
  if (size === 'full') return { maxWidth: '96vw', width: '96vw' };
  const widths: Record<string, string> = {
    "2xl": "672px",
    "3xl": "768px",
    "4xl": "896px",
    "5xl": "1024px",
    "6xl": "1152px",
    "7xl": "1280px",
  };
  if (size && widths[size]) return { maxWidth: widths[size], width: '100%' };
  return {};
};

export const Modal = ({
  open,
  onClose,
  title,
  subtitle,
  disableBackdropClose = false,
  children,
  maxWidth = "md",
  noPadding = false,
  fullScreen = false,
  onToggleFullScreen,
  headerActions,
}: ModalProps) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const muiMaxWidth = getMuiMaxWidth(maxWidth);
  const widthSx = getWidthSx(maxWidth);
  const isFull = fullScreen && !isMobile;

  return (
    <Dialog
      open={open}
      onClose={(_e, reason) => {
        if (disableBackdropClose && reason === "backdropClick") return;
        onClose();
      }}
      fullWidth
      maxWidth={isMobile || isFull ? false : muiMaxWidth}
      fullScreen={isFull}
      scroll="paper"
      disableEnforceFocus

      sx={isMobile ? { '& .MuiDialog-container': { alignItems: 'flex-end' } } : {}}
      PaperProps={{
        sx: isMobile ? {
          borderRadius: '20px 20px 0 0',
          margin: 0,
          width: '100%',
          maxWidth: '100%',
          maxHeight: '90dvh',
          boxShadow: 24,
        } : isFull ? {
          borderRadius: 0,
          margin: 0,
          width: '100vw',
          maxWidth: '100vw',
          height: '100dvh',
          maxHeight: '100dvh',
        } : {
          borderRadius: 3,
          boxShadow: 24,
          maxHeight: '96vh',
          ...widthSx
        }
      }}
    >
      <DialogTitle sx={{
        m: 0,
        px: { xs: 2, sm: 3 },
        pt: 1.5,
        pb: 0,
        fontSize: '1rem',
        fontWeight: 600,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexShrink: 0,
      }}>
        <Box sx={{
          flex: 1,
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap',
          pr: 2
        }}>
          {title}
          {subtitle && (
            <Box component="div" sx={{ mt: 0.25, fontSize: "0.75rem", fontWeight: 400, color: "text.secondary", whiteSpace: "normal" }}>
              {subtitle}
            </Box>
          )}
        </Box>
        {headerActions && <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mr: 1, fontWeight: 400 }}>{headerActions}</Box>}
        {onToggleFullScreen && !isMobile && (
          <IconButton
            aria-label={isFull ? "Salir de pantalla completa" : "Pantalla completa"}
            title={isFull ? "Salir de pantalla completa" : "Pantalla completa"}
            onClick={onToggleFullScreen}
            sx={{
              color: 'text.secondary',
              mr: 0.5,
              '&:hover': { color: 'text.primary', bgcolor: 'action.hover' },
            }}
            size="small"
          >
            {isFull ? <FullscreenExitIcon fontSize="small" /> : <FullscreenIcon fontSize="small" />}
          </IconButton>
        )}
        <IconButton
          aria-label="close"
          onClick={onClose}
          sx={{
            color: 'text.secondary',
            '&:hover': { color: 'text.primary', bgcolor: 'action.hover' },
          }}
          size="small"
        >
          <CloseIcon fontSize="small" />
        </IconButton>
      </DialogTitle>
      <DialogContent sx={{ 
        p: noPadding ? '0 !important' : { xs: 1.5, sm: 2.5 }, 
        pt: noPadding ? '0 !important' : { xs: 1.5, sm: 2 }, 
        overflowY: noPadding ? 'hidden' : 'auto',
        display: noPadding ? 'flex' : 'block',
        flexDirection: noPadding ? 'column' : 'initial'
      }}>
        {children}
      </DialogContent>
    </Dialog>
  );
};
